import React, { Component, Fragment } from 'react';
import { Bullseye, EmptyState, EmptyStateIcon, Title, EmptyStateBody } from '@patternfly/react-core';
import { Pagination } from '../../../../PresentationalComponents/Pagination';
import routerParams from '../../../../Utilities/RouterParams';
import { TableVariant } from '../../../../PresentationalComponents/Table';
import findIndex from 'lodash/findIndex';
import propTypes from 'prop-types';
import { RowLoader } from '../../../../Utilities/helpers';
import { Table, TableHeader, TableBody, SortByDirection } from '@patternfly/react-table';
import { TableToolbar } from '../../../../PresentationalComponents/TableToolbar';
import { CubesIcon } from '@patternfly/react-icons';

class VulnerabilitiesCveTable extends Component {
    state = { selectedCves: new Set() };

    changePage = page => this.props.apply({ page });

    // eslint-disable-next-line camelcase
    setPageSize = pageSize => this.props.apply({ page_size: pageSize });

    sortColumn = (event, key, direction) => {
        let columnMapping = this.props.isSelectable ? [{ key: 'checkbox' }, ...this.props.header ] : this.props.header;
        let columnName = columnMapping[key].key;
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

    createSortBy = value => {
        if (value) {
            let columnMapping = this.props.isSelectable ? [{ key: 'checkbox' }, ...this.props.header ] : this.props.header;
            let direction = value[0] === '+' ? SortByDirection.asc : SortByDirection.desc;
            value = value.replace(/^(-|\+)/, '');
            const index = findIndex(columnMapping, item => item.key === value);
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
                { cves.meta.filter ? (
                    <EmptyState>
                        <Title headingLevel="h5" size="lg">
                            No matching CVEs found
                        </Title>
                        <Title headingLevel="h4" size="sm">
                                This may be for one of the following reasons:
                        </Title>
                        <EmptyStateBody>
                            <ul>
                                <li> The criteria/filters you’ve specified result in no/zero CVEs being reported in your environment</li>
                                <li>If you think a CVE that matches this criteria does apply to Red Hat, or would like more information,
                                 please contact the Security Response Team</li>
                                <li>In addition, the MITRE CVE dictionary may provide information about your CVE</li>
                            </ul>
                        </EmptyStateBody>
                    </EmptyState>
                ) : (
                    <EmptyState>
                        <Title headingLevel="h5" size="lg">
                                No CVEs reported for this system
                        </Title>
                        <Title headingLevel="h4" size="sm">
                                This may be for one of the following reasons:
                        </Title>
                        <EmptyStateBody>
                            <ul>
                                <li>No published CVEs affect this system</li>
                                <li>You have opted out of reporting on a reported CVE</li>
                                <li>If you think this system has applicable CVEs, or would like more information,
                                 please contact the Security Response Team.</li>
                            </ul>
                        </EmptyStateBody>
                    </EmptyState>
                ) }
            </Bullseye>
        );
    };

    onSelect = (event, isSelected, rowId) => {
        const { cves } = this.props;
        const { selectedCves } = this.state;
        if (rowId === -1) {
            isSelected ? cves.data.forEach(cve => selectedCves.add(cve.id)) : cves.data.forEach(cve => selectedCves.delete(cve.id));
        } else {
            const cveName = cves.data[rowId] && cves.data[rowId].id;
            isSelected ? selectedCves.add(cveName) : selectedCves.delete(cveName);
        }

        this.setState(selectedCves, () => this.props.selectorHandler(selectedCves));
    };

    render() {
        const { cves, header } = this.props;
        const { selectedCves } = this.state;
        const rows = cves.data.map(cve => (selectedCves.has(cve.id) && { ...cve, selected: true }) || cve);
        const loader = [ ...Array(3) ].map(() => ({
            cells: [
                {
                    title: <RowLoader />,
                    props: {
                        colSpan: header.length
                    }
                }
            ]
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
                    { (!cves.isLoading && cves.data.length === 0 && this.noCves()) || (
                        <div>
                            <TableHeader />
                            <TableBody />
                            <TableToolbar isFooter>{ this.createPagination() }</TableToolbar>
                        </div>

                    ) }

                </Table>
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
