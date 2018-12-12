import React, { Component } from 'react';
import { Pagination, dropDirection } from '../../PresentationalComponents/Pagination';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { InventoryContext } from './Inventory';

const perPageOptions = [20, 50, 100, 200]

class ContextFooterPagination extends Component {
    constructor(props) {
        super(props);
    }

    onSetPage = (page) => {
        const { perPage, onRefreshData } = this.props;
        onRefreshData({ page, per_page: perPage });
    }

    onPerPageSelect = (perPage) => {
        const { page, onRefreshData } = this.props;
        onRefreshData({ page, per_page: perPage });
    }

    render() {
        const { total, page, perPage } = this.props;
        return (
            <Pagination
                numberOfItems={total}
                perPageOptions={perPageOptions}
                page={page}
                itemsPerPage={perPage}
                direction={dropDirection.up}
                onSetPage={this.onSetPage}
                onPerPageSelect={this.onPerPageSelect}
            />
        )
    }
}

const FooterPagination = ({ ...props }) => (
    <InventoryContext.Consumer>
        {({ onRefreshData }) => (
            <ContextFooterPagination {...props} onRefreshData={ onRefreshData } />
        )}
    </InventoryContext.Consumer>
)

FooterPagination.propTypes = {
    total: PropTypes.number,
    onRefreshData: PropTypes.func
}
FooterPagination.defaultProps = {
    total: 0,
    onRefreshData: () => undefined
}

function stateToProps({ entities: { page, perPage, total }}) {
    return {
        page, perPage, total
    }
}

function dispatchToProps(dispatch) {
    return {

    }
}

export default connect(stateToProps, dispatchToProps)(FooterPagination);
