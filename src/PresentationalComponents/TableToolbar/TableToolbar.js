import React, { Fragment } from 'react';
import propTypes from 'prop-types';

import classNames from 'classnames';

import './TableToolbar.scss';

const TableToolbar = ({ results, className, children, ...props }) => {

    const tableToolbarClasses = classNames(
        'ins-c-table__toolbar',
        className
    );

    return (
        <Fragment>
            <div className={ tableToolbarClasses } { ...props }> { children }</div>
            {
                results &&
                <div className='ins-c-table__toolbar-results'> { results } Result{ results > 1 && 's' } </div>
            }
        </Fragment>
    );
};

export default TableToolbar;

TableToolbar.propTypes = {
    results: propTypes.number,
    children: propTypes.any,
    className: propTypes.string
};
