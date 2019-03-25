import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './spinner.scss';

const Spinner = ({ centered, className, ...props }) => {

    let spinnerClasses = classNames(
        'ins-c-spinner',
        { [`ins-m-center`]: centered },
        className
    );

    return (
        <span className={ spinnerClasses } {...props} />
    );
};

Spinner.propTypes = {
    centered: PropTypes.bool,
    className: PropTypes.string
};


export default Spinner;
