/* eslint-disable camelcase */
import React, { Component } from 'react';
import { Checkbox, Form, FormGroup, FormSelect, FormSelectOption, Grid, GridItem, ToolbarGroup } from '@patternfly/react-core';
import routerParams from '../../../../Utilities/RouterParams';
import { SimpleTableFilter } from '../../../../PresentationalComponents/SimpleTableFilter';
import { DownloadButton } from '../../../../PresentationalComponents/DownloadButton';
import { TableToolbar } from '../../../../PresentationalComponents/TableToolbar';
import debounce from 'lodash/debounce';
import propTypes from 'prop-types';
import RemediationButton from '../../../Remediations/RemediationButton';
import { connect } from 'react-redux';
import { addNotification } from '../../../Notifications';
import { Pagination } from '../../../../PresentationalComponents/Pagination';

const CVSSOptions = [
    { value: 'all', label: 'CVSS Base Score: All', disabled: false, from: '', to: '' },
    { value: 'from0less3', label: 'CVSS < 3.0', disabled: false, from: '', to: 2.999 },
    { value: 'from3less7', label: 'CVSS >= 3.0 and CVSS < 7.0', disabled: false, from: 3, to: 6.999 },
    { value: 'from7to10', label: 'CVSS >= 7.0 and CVSS <= 10.0', disabled: false, from: 7, to: 10 }
];

class VulnerabilitiesCveTableToolbar extends Component {
    state = {};

    changeFilterValue = debounce(
        value =>
            this.setState(
                {
                    ...this.state,
                    filter: value
                },
                this.apply
            ),
        400
    );

    changePage = page => this.setState({ ...this.state, page }, this.apply);
    setPageSize = pageSize => this.setState({ ...this.state, page_size: pageSize }, this.apply);

    apply = () => this.props.apply(this.state);

    changeCVSSValue = (value, options) => {
        const target = options.find(item => item.value === value);
        this.setState({ ...this.state, cvss_from: target.from, cvss_to: target.to }, this.apply);
    };

    changeCheckboxValue = value => {
        this.setState({ ...this.state, show_all: !value }, this.apply);
    };

    getCVSSValue = options => {
        const option = options.find(item => item.from === this.state.cvss_from && item.to === this.state.cvss_to);
        return option ? option.value : options[0].value;
    };

    remediationProvider = () => {
        if (!this.props.selectedCves || this.props.selectedCves.size === 0) {
            return false;
        }

        return {
            issues: [ ...this.props.selectedCves ].map(cve => ({ id: `vulnerabilities:${cve}`, description: cve })),
            systems: [ this.props.entity.id ]
        };
    };

    render() {
        const { showAllCheckbox, downloadReport, totalNumber, showRemediationButton, cves } = this.props;
        const selectedCvesCount =
            this.props.showRemediationButton === true ? (this.props.selectedCves && this.props.selectedCves.size) || 0 : undefined;
        return (
            <TableToolbar className="pf-u-justify-content-space-between" results={ totalNumber } selected={ selectedCvesCount }>
                <ToolbarGroup className="space-between-toolbar-items">
                    <SimpleTableFilter onFilterChange={ value => this.changeFilterValue(value) } buttonTitle={ null } placeholder="Find a CVE…" />

                    <Form>
                        <FormGroup fieldId="cvssScore">
                            <FormSelect
                                id="cvssScore"
                                onChange={ value => this.changeCVSSValue(value, CVSSOptions) }
                                value={ this.getCVSSValue(CVSSOptions) }
                            >
                                { CVSSOptions.map((option, index) => (
                                    <FormSelectOption isDisabled={ option.disabled } key={ index } value={ option.value } label={ option.label } />
                                )) }
                            </FormSelect>
                        </FormGroup>
                    </Form>
                </ToolbarGroup>
                { showAllCheckbox && (
                    <React.Fragment>
                        <br />
                        <Checkbox
                            label="Hide CVEs that do not affect my inventory"
                            isChecked={ !this.state.show_all }
                            onChange={ state => this.changeCheckboxValue(state) }
                            aria-label="hide CVEs checkbox"
                            id="toolbar-cves-hide-check"
                        />
                    </React.Fragment>
                ) }
                { showRemediationButton && (
                    <RemediationButton
                        dataProvider={ this.remediationProvider }
                        isDisabled={ this.remediationProvider() === false }
                        onRemediationCreated={ result => this.props.addNotification(result.getNotification()) }
                    />
                ) }
                <ToolbarGroup>
                    <Pagination
                        page={ cves.meta.page || 1 }
                        numberOfItems={ cves.meta.total_items || 0 }
                        itemsPerPage={ cves.meta.page_size || 50 }
                        onSetPage={ page => this.changePage(page) }
                        onPerPageSelect={ pageSize => this.setPageSize(pageSize) }
                    />
                </ToolbarGroup>
            </TableToolbar>
        );
    }
}

VulnerabilitiesCveTableToolbar.propTypes = {
    CVETable: propTypes.any,
    apply: propTypes.func,
    showAllCheckbox: propTypes.bool,
    showRemediationButton: propTypes.bool,
    totalNumber: propTypes.number,
    downloadReport: propTypes.func,
    cves: propTypes.any,
    entity: propTypes.object,
    addNotification: propTypes.func.isRequired,
    selectedCves: propTypes.any
};

VulnerabilitiesCveTableToolbar.defaultProps = {
    showAllCheckbox: false,
    showRemediationButton: false,
    totalNumber: 0,
    apply: () => undefined,
    downloadReport: () => undefined
};

export default connect(
    null,
    dispatch => ({
        addNotification: notification => dispatch(addNotification(notification))
    })
)(routerParams(VulnerabilitiesCveTableToolbar));
