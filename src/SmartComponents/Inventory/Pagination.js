import React, { Component, Fragment } from 'react';
import { Pagination, dropDirection } from '../../PresentationalComponents/Pagination';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { InventoryContext } from './Inventory';

const perPageOptions = [ 10, 20, 50, 100 ];

class ContextFooterPagination extends Component {
    constructor(props) {
        super(props);
    }

    onSetPage = (page) => {
        const { perPage, onRefreshData } = this.props;
        // eslint-disable-next-line camelcase
        onRefreshData({ page, per_page: perPage });
    }

    onPerPageSelect = (perPage) => {
        const { page, onRefreshData } = this.props;
        // eslint-disable-next-line camelcase
        onRefreshData({ page, per_page: perPage });
    }

    render() {
        const { total, page, perPage, loaded } = this.props;
        return (
            <Fragment>
                { loaded && (
                    <Pagination
                        numberOfItems={ total }
                        perPageOptions={ perPageOptions }
                        page={ page }
                        itemsPerPage={ perPage }
                        direction={ dropDirection.up }
                        onSetPage={ this.onSetPage }
                        onPerPageSelect={ this.onPerPageSelect }
                    />
                ) }
            </Fragment>
        );
    }
}

const FooterPagination = ({ ...props }) => (
    <InventoryContext.Consumer>
        { ({ onRefreshData }) => (
            <ContextFooterPagination { ...props } onRefreshData={ onRefreshData } />
        ) }
    </InventoryContext.Consumer>
);

const propTypes = {
    perPage: PropTypes.number,
    total: PropTypes.number,
    loaded: PropTypes.bool
};

ContextFooterPagination.propTypes = {
    ...propTypes,
    onRefreshData: PropTypes.func
};

FooterPagination.propTypes = propTypes;

FooterPagination.defaultProps = {
    total: 0,
    loaded: false,
    onRefreshData: () => undefined
};

function stateToProps({ entities: { page, perPage, total, loaded }}) {
    return {
        page, perPage, total, loaded
    };
}

function dispatchToProps(dispatch) {
    return {

    };
}

export default connect(stateToProps, dispatchToProps)(FooterPagination);
