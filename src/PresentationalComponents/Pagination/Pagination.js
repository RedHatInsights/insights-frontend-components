import React, { Component } from 'react';
import { PaginationRow } from 'patternfly-react';
import PaginationNext from './PaginationNext';
import PropTypes from 'prop-types';

export const dropDirection = {
    up: 'up',
    down: 'down'
};

const pager = [ 10, 15, 20, 25, 50 ];

class Pagination extends Component {
    setPage = (page, debounce = false) => {
        const { page: currPage } = this.props;
        const perPage = this.props.itemsPerPage || pager[0];
        const maxPage = Math.ceil(this.props.numberOfItems / perPage);
        page = isNaN(page) ? currPage : page;
        page = page > maxPage ? maxPage : page < 0 ? 0 : page;
        this.props.hasOwnProperty('onSetPage') && this.props.onSetPage(page, debounce);
    }

    defaultFirstPage = () => {
        this.setPage(1);
    }

    defaultLastPage = () => {
        const perPage = this.props.itemsPerPage || pager[0];
        this.setPage(Math.ceil(this.props.numberOfItems / perPage));
    }

    defaultPreviousPage = () => {
        const { page = 1 } = this.props;
        this.setPage(page - 1);
    }

    defaultNextPage = () => {
        const { page = 1 } = this.props;
        this.setPage(page + 1);
    }

    render() {
        let { page, onSetPage, numberOfItems, useNext, itemsPerPage, perPageOptions, onPerPageSelect, ...props } = this.props;
        const pagerOptions = perPageOptions || pager;
        const perPage = itemsPerPage || pagerOptions[0];
        const lastPage = Math.ceil(numberOfItems / perPage);
        let lastIndex = numberOfItems === 0 ? 0 : page === lastPage ? numberOfItems : page * perPage;
        let firstIndex = numberOfItems === 0 ? 0 : (page - 1) * perPage + 1;

        return (
            <React.Fragment>
                {
                    !useNext && typeof PaginationRow !== 'undefined' ?
                        <div className="special-patternfly" widget-type='InsightsPagination'>
                            <PaginationRow
                                { ...this.props }
                                pageInputValue={ this.props.page || 1 }
                                viewType={ this.props.viewType || 'table' }
                                pagination={ { perPage, page, perPageOptions: pagerOptions } }
                                amountOfPages={ lastPage || 1 }
                                itemCount={ this.props.numberOfItems }
                                itemsStart={ firstIndex }
                                pageSizeDropUp={ this.props.direction === 'up' }
                                itemsEnd={ lastIndex }
                                onPerPageSelect={ onPerPageSelect }
                                onPageInput={ event => this.setPage(parseInt(event.target.value, 10), true) }
                                onFirstPage={ this.props.onFirstPage || this.defaultFirstPage }
                                onLastPage={ this.props.onLastPage || this.defaultLastPage }
                                onPreviousPage={ this.props.onPreviousPage || this.defaultPreviousPage }
                                onNextPage={ this.props.onNextPage || this.defaultNextPage }
                            />
                        </div> :
                        <PaginationNext { ...props }
                            itemCount={ this.props.numberOfItems }
                            itemsStart={ firstIndex }
                            itemsEnd={ lastIndex }
                            lastPage={ lastPage || 1 }
                            dropDirection={ this.props.direction }
                            onSetPerPage={ (event, value) => this.props.onPerPageSelect(value) }
                            page={ this.props.page || 1 }
                            setPage={ (event, page) => this.setPage(page, event.target.tagName.toUpperCase() === 'INPUT') }
                            perPageOptions={ pagerOptions.map(value => ({
                                title: value,
                                value
                            })) }
                        />
                }
            </React.Fragment>
        );
    }
}

Pagination.propTypes = {
    direction: PropTypes.oneOf(Object.keys(dropDirection)),
    viewType: PropTypes.string,
    itemsPerPage: PropTypes.number,
    perPageOptions: PropTypes.arrayOf(PropTypes.number),
    numberOfItems: PropTypes.number.isRequired,
    onSetPage: PropTypes.func,
    onPerPageSelect: PropTypes.func,
    onFirstPage: PropTypes.func,
    onLastPage: PropTypes.func,
    onPreviousPage: PropTypes.func,
    onNextPage: PropTypes.func,
    useNext: PropTypes.bool
};

Pagination.defaultProps = {
    page: 1,
    useNext: false
};

export default Pagination;
