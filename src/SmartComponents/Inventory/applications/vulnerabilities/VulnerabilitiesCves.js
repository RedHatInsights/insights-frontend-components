import React, { Component } from 'react';
import { Stack, StackItem } from '@patternfly/react-core';
import { getCveListBySystem } from '../../../../api/vulnerabilities';
import some from 'lodash/some';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import VulnerabilitiesCveTable from './VulnerabilitiesCveTable';
import VulnerabilitiesCveTableToolbar from './VulnerabilitiesCveTableToolbar';
import { createCveListBySystem } from './DataMapper';
import { downloadFile } from '../../../../Utilities/helpers';

class VulnerabilitiesCves extends Component {
    componentDidMount() {
        this.sendRequest();
    }

    apply = (config) => {
        const toBeReset = [ 'filter', 'page_size', 'show_all' ];
        if (some(toBeReset.map(item => config.hasOwnProperty(item)), item => item === true)) {
            config.page = 1;
        }

        this.setState({ ...this.state, ...config }, this.sendRequest);
    }

    sendRequest = () => {
        const { fetchData } = this.props;
        fetchData && fetchData(() => this.props.fetchResource(this.state));
    }

    downloadReport = () => {
        // eslint-disable-next-line camelcase
        getCveListBySystem({ ...this.state, page_size: 9999, data_format: 'csv' }).then(
            ({ data }) => downloadFile(data)
        );
    }

    render() {
        const { cveList, header } = this.props;
        const cves = createCveListBySystem(cveList);
        return (
            <React.Fragment>
                <Stack gutter="lg">
                    <StackItem>
                        <VulnerabilitiesCveTableToolbar
                            apply={ this.apply }
                            totalNumber={ cves.meta.total_items }
                            downloadReport={ this.downloadReport }
                        />
                    </StackItem>
                    <StackItem>
                        <VulnerabilitiesCveTable
                            header={ header }
                            cves={ cves }
                            apply={ this.apply }
                        />
                    </StackItem>
                </Stack>
            </React.Fragment>
        );
    }
}

function mapStateToProps({ VulnerabilitiesStore: { cveList }}) {
    return {
        cveList
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchData: action => dispatch(action())
    };
};

VulnerabilitiesCves.propTypes = {
    cveList: propTypes.any,
    fetchData: propTypes.func,
    fetchResource: propTypes.func,
    header: propTypes.array,
    showAllCheckbox: propTypes.bool
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(VulnerabilitiesCves);
