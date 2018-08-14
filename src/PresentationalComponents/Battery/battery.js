import React from 'react';
import propTypes from 'prop-types';

import classNames from 'classnames';

import './battery.scss';

/**
 * This is the battery component that generates a 'battery'
 * which corresponds to a level 1-4
 * 1 - low, green - best case scenario
 * 2 - medium, yellow
 * 3 - high, orange
 * 4 - critical, red - worst case scenario
 * Also accepts a label which can be made invisible
 */

const Battery = ({ severity, label, labelHidden, className, ...props }) => {

    let batteryWrapperClasses = classNames(
        className,
        'ins-battery'
    );

    let batteryClasses = classNames(
        { [`ins-battery-${severity}`]: severity !== undefined }
    );

    function generateBattery (severity, batteryClasses) {
        return (
            <i className= { batteryClasses }>
                <svg
                    version="1.1"
                    id="battery_svg"
                    x="0px" y="0px"
                    viewBox="0 0 448 512"
                    style={{ enableBackground: 'new 0 0 448 512' }}
                    shapeRendering= 'geometricpresision'>
                    { batteryLevels(severity) }
                </svg>
            </i>
        );
    }

    function batteryLevels (severity) {
        switch (severity) {
            case 'critical':
                return <path d="M16,212h416c8.8,0,16-7.2,16-16v-40c0-8.8-7.2-16-16-16H16c-8.8,0-16,7.2-16,16v40C0,204.8,7.2,212,16,212z M16,372h416
                c8.8,0,16-7.2,16-16v-40c0-8.8-7.2-16-16-16H16c-8.8,0-16,7.2-16,16v40C0,364.8,7.2,372,16,372z M16,512h416c8.8,0,16-7.2,16-16v-40
                c0-8.8-7.2-16-16-16H16c-8.8,0-16,7.2-16,16v40C0,504.8,7.2,512,16,512z M16,72h416c8.8,0,16-7.2,16-16V16c0-8.8-7.2-16-16-16H16
                C7.2,0,0,7.2,0,16v40C0,64.8,7.2,72,16,72z"/>;
            case 'high':
                return <path d="M16,212h416c8.8,0,16-7.2,16-16v-40c0-8.8-7.2-16-16-16H16c-8.8,0-16,7.2-16,16v40C0,204.8,7.2,212,16,212z M16,372h416
                c8.8,0,16-7.2,16-16v-40c0-8.8-7.2-16-16-16H16c-8.8,0-16,7.2-16,16v40C0,364.8,7.2,372,16,372z M16,512h416c8.8,0,16-7.2,16-16v-40
                c0-8.8-7.2-16-16-16H16c-8.8,0-16,7.2-16,16v40C0,504.8,7.2,512,16,512z"/>;
            case 'medium':
                return <path d="M16,372h416c8.8,0,16-7.2,16-16v-40c0-8.8-7.2-16-16-16H16c-8.8,0-16,7.2-16,16v40C0,364.8,7.2,372,16,372z M16,512h416
                c8.8,0,16-7.2,16-16v-40c0-8.8-7.2-16-16-16H16c-8.8,0-16,7.2-16,16v40C0,504.8,7.2,512,16,512z"/>;
            case 'low':
                return <path d="M16,512h416c8.8,0,16-7.2,16-16v-40c0-8.8-7.2-16-16-16H16c-8.8,0-16,7.2-16,16v40C0,504.8,7.2,512,16,512z"/>;
            default:
                return null;
        }
    }

    if (!labelHidden) {
        return (
            <span className= { batteryWrapperClasses }  { ...props }>
                { generateBattery(severity, batteryClasses) }
                <span className='label'> { label } </span>
            </span>
        );
    } else {
        return (
            <span className= { batteryWrapperClasses }  { ...props }>
                { generateBattery(severity, batteryClasses) }
            </span>
        );
    }
};

export default Battery;

Battery.propTypes = {
    severity: propTypes.oneOfType([
        propTypes.string.isRequired,
        propTypes.number.isRequired
    ]),
    label: propTypes.string.isRequired,
    labelHidden: propTypes.bool
};
