import React from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonVariant } from '@patternfly/react-core';
import { AngleDoubleLeftIcon, AngleLeftIcon, AngleDoubleRightIcon, AngleRightIcon } from '@patternfly/react-icons';

const PaginationNav = ({ lastPage, setPage, pageTitle, amountOfPages, page, ...props }) => {
    return <nav className="pf-c-pagination__nav" aria-label="Pagination" { ...props }>
        <Button variant={ ButtonVariant.plain }
            isDisabled={ page === 1 }
            aria-label="Go to first page"
            onClick={ event => setPage(event, 1) }
        >
            <AngleDoubleLeftIcon />
        </Button>
        <Button variant={ ButtonVariant.plain }
            isDisabled={ page === 1 }
            aria-label="Go to previous page"
            onClick={ event => setPage(event, page - 1) }
        >
            <AngleLeftIcon />
        </Button>
        <div className="pf-c-pagination__nav-page-select" aria-label="Current page 1 of 4">
            <input className="pf-c-form-control"
                aria-label="Current page"
                type="number"
                min="1"
                max={ amountOfPages }
                size="2"
                value={ page }
                onChange={ event => setPage(event, Number(event.target.value)) }
            />
            <span aria-hidden="true">of { lastPage } { pageTitle }</span>
        </div>
        <Button variant={ ButtonVariant.plain }
            isDisabled={ page === lastPage }
            aria-label="Go to next page"
            onClick={ event => setPage(event, page + 1) }
        >
            <AngleRightIcon />
        </Button>
        <Button variant={ ButtonVariant.plain }
            isDisabled={ page === lastPage }
            aria-label="Go to last page"
            onClick={ event => setPage(event, lastPage) }
        >
            <AngleDoubleRightIcon />
        </Button>
    </nav>;
};

PaginationNav.propTypes = {
    lastPage: PropTypes.number,
    page: PropTypes.number,
    pageTitle: PropTypes.string,
    setPage: PropTypes.func,
    amountOfPages: PropTypes.number
};

PaginationNav.defaultProps = {
    pageTitle: 'pages'
};

export default PaginationNav;
