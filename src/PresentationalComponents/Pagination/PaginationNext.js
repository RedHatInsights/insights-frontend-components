import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PaginationNav from './PaginationNav';
import PaginationMenu from './PaginationMenu';
import '@patternfly/patternfly-next/components/Pagination/pagination.scss';
import '@patternfly/patternfly-next/components/OptionsMenu/options-menu.scss';

class PaginationNext extends Component {
    render() {
        const {
            className,
            page,
            lastPage,
            setPage,
            itemsStart,
            itemsEnd,
            widtgetId,
            onSetPerPage,
            itemCount,
            perPageOptions,
            dropDirection,
            amountOfPages,
            ...props
        } = this.props;
        return (
            <div className={ `pf-c-pagination pf-m-footer ${className}` }  aria-label="Element pagination" { ...props }>
                <PaginationMenu
                    itemsStart={ itemsStart }
                    itemsEnd={ itemsEnd }
                    widtgetId={ widtgetId }
                    dropDirection={ dropDirection }
                    onSetPerPage={ onSetPerPage }
                    itemCount={ itemCount }
                    perPageOptions={ perPageOptions }
                />
                <PaginationNav lastPage={ lastPage } page={ page } setPage={ setPage } />
            </div>
        );
    }
}

PaginationNext.propTypes = {
    amountOfPages: PropTypes.number,
    itemCount: PropTypes.number.isRequired,
    page: PropTypes.number,
    itemsStart: PropTypes.number,
    itemsEnd: PropTypes.number,
    widtgetId: PropTypes.string,
    dropDirection: PropTypes.string,
    onSetPerPage: PropTypes.func,
    perPageOptions: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.node,
        value: PropTypes.number
    })),
    lastPage: PropTypes.number,
    setPage: PropTypes.func
};

export default PaginationNext;
