import React, { Component } from 'react';
import propTypes from 'prop-types';
import * as c3 from 'c3';
import classNames from 'classnames';

import './donut.scss';

/**
 * Donut used for comparing values
 */

class Donut extends Component {

    componentDidMount () {
        this._updateChart();
    }

    _updateChart () {
        let data = {
            type: 'donut',
            columns: this.props.values,
            donut: {
                title: 'Donut'
            }
        };

        let donutConfig = {
            bindto: '#' + this.props.identifier,
            data,
            size: {
                width: this.props.width,
                height: this.props.height
            },
            legend: {
                show: false
            },
            donut: {
                width: 10,
                label: {
                    show: false
                }
            }
        };

        let donut = c3.generate(donutConfig); // eslint-disable-line
    }

    render () {

        const donutClasses = classNames(
            this.props.className,
            'ins-c-donut'
        );

        return (
            <div className='ins-l-donut'>
                <div id={this.props.identifier} className={donutClasses}></div>
                <div className='ins-c-donut-hole'>
                    <span className='ins-c-donut-hole--total__number'>{this.props.total}</span>
                    <span className='ins-c-donut-hole--total__label'>{this.props.totalLabel}</span>
                </div>
            </div>
        );
    }
}

export default Donut;

/**
 * generate random ID if one is not supplied
 */
function generateId () {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 5; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}

Donut.propTypes = {
    className: propTypes.string,
    height: propTypes.number,
    identifier: propTypes.string,
    values: propTypes.array,
    width: propTypes.number,
    total: propTypes.number,
    totalLabel: propTypes.string
};

Donut.defaultProps = {
    height: 200,
    identifier: generateId(),
    width: 200
};
