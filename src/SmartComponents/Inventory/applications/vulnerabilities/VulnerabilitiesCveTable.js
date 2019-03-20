import React, { Component, Fragment } from 'react';
import { Bullseye } from '@patternfly/react-core';
import { Pagination } from '../../../../PresentationalComponents/Pagination';
import routerParams from '../../../../Utilities/RouterParams';
import { SortDirection, TableVariant } from '../../../../PresentationalComponents/Table';
import findIndex from 'lodash/findIndex';
import propTypes from 'prop-types';
import { RowLoader } from '../../../../Utilities/helpers';
import { Table, TableHeader, TableBody, sortable, SortByDirection } from '@patternfly/react-table';
import { TableToolbar } from '../../../../PresentationalComponents/TableToolbar';

class VulnerabilitiesCveTable extends Component {
    state = { selectedCves: new Set() };

    changePage = page => this.props.apply({ page });

    // eslint-disable-next-line camelcase
    setPageSize = pageSize => this.props.apply({ page_size: pageSize });

    sortColumn = (event, key, direction) => {
        let columnName = this.props.header[key].key;
        const { cves } = this.props;
        const currentSort = cves.meta.sort;
        const useDefault = currentSort && currentSort.substr(1) !== columnName;
        if (direction === SortByDirection.desc || useDefault) {
            columnName = '-' + columnName;
        }

        this.props.apply({ sort: columnName });
    };

    createPagination = () => {
        const {
            cves: { meta }
        } = this.props;
        return (
            <Pagination
                page={ meta.page || 1 }
                numberOfItems={ meta.total_items || 0 }
                itemsPerPage={ meta.page_size || 50 }
                onSetPage={ page => this.changePage(page) }
                onPerPageSelect={ pageSize => this.setPageSize(pageSize) }
            />
        );
    };

    createSortBy = (value) => {
        if (value) {
            let direction = value[0] === '+' ? SortByDirection.asc : SortByDirection.desc;
            value = value.replace(/^(-|\+)/, '');
            const index = findIndex(this.props.header, item => item.key === value);
            let sort = {
                index,
                direction
            };
            return sort;
        }

        return {};
    };

    noCves = () => {
        const { cves } = this.props;
        return (
            <Bullseye>
                <b>
                    { cves.meta.filter
                        ? `None of your systems are currently exposed to any CVE matching filter " ${cves.meta.filter}"`
                        : 'You are not exposed to any CVEss.' }
                </b>
            </Bullseye>
        );
    };

    onSelect = (event, isSelected, rowId) => {
        const { cves } = this.props;
        const { selectedCves } = this.state;
        if (rowId === -1) {
            isSelected ? cves.data.forEach(cve => selectedCves.add(cve.id)) : cves.data.forEach(cve => selectedCves.delete(cve.id));
        }
        else {
            const cveName = cves.data[rowId] && cves.data[rowId].id;
            isSelected ? selectedCves.add(cveName) : selectedCves.delete(cveName);
        }

        this.setState(selectedCves, () => this.props.selectorHandler(selectedCves));
    }

    render() {
        const { cves, header } = this.props;
        const { selectedCves } = this.state;
        const rows = cves.data.map(cve => (selectedCves.has(cve.id) && { ...cve, selected: true }) || cve);
        const loader = [ ...Array(3) ].map(() => ({
            cells: [{
                title: <RowLoader />,
                props: {
                    colSpan: header.length }
            }]
        }));
        return (
            <Fragment>
                <Table
                    aria-label={ 'Vulnerability CVE table' }
                    onSelect={ (this.props.isSelectable && this.onSelect) || undefined }
                    variant={ TableVariant.compact }
                    cells={ header }
                    rows={ cves.isLoading ? loader : rows }
                    sortBy={ this.createSortBy(cves.meta.sort) }
                    onSort={ this.sortColumn }
                >
                    <TableHeader />
                    <TableBody/>
                </Table>
                <TableToolbar isFooter>
                    { this.createPagination() }
                </TableToolbar>
                { !cves.isLoading && cves.data.length === 0 && this.noCves() }
            </Fragment>
        );
    }
}

VulnerabilitiesCveTable.propTypes = {
    cves: propTypes.any,
    header: propTypes.array,
    history: propTypes.object,
    apply: propTypes.func,
    selectorHandler: propTypes.func,
    isSelectable: propTypes.bool
};
export default routerParams(VulnerabilitiesCveTable);
