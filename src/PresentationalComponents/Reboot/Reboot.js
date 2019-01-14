import React from 'react';
import propTypes from 'prop-types';

import classNames from 'classnames';

import { RebootingIcon } from '@patternfly/react-icons';

import './reboot.scss';

/**
 * This is a dumb component that only recieves properties from a smart component.
 * Dumb components are usually functions and not classes.
 *
 * @param props the props given by the smart component.
 */

const Reboot = ({ red, className, ...props }) => {

    const rebootIconClasses = classNames(
        'ins-c-reboot',
        { [`ins-m-red`]: red },
        className
    );

    return (
        <span className={ rebootIconClasses } { ...props }>
            <RebootingIcon/>
            <span>Needs Reboot</span>
        </span>
    );
};

export default Reboot;

Reboot.propTypes = {
    className: propTypes.string,
    red: propTypes.bool
};
