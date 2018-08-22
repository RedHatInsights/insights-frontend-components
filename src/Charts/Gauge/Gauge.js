import React, { Component } from 'react';
import propTypes from 'prop-types';
import * as c3 from 'c3';
import classNames from 'classnames';

import './gauge.scss';

/**
 * Gauge used for displaying statuses
 */

class Gauge extends Component {

    componentDidMount () {
        this._updateChart();
    }    

    _updateChart () {
        let data = {
            type : 'gauge',
            columns: [
                [this.props.label, this.props.value]
            ]
        };

        let gaugeConfig = {
            bindto: '#' + this.props.identifier,
            data: data,
            size: {
                width: this.props.width,
                height: this.props.height
            },
            legend: {
                show: false
            },
            gauge: {
                fullCircle: true,
                label: {
                    show: false
                },
                width: 8,
                startingAngle: 2*Math.PI
            },
            color: {
                pattern: ['#FF0000', '#F97600', '#F6C600', '#4AC956'],
                threshold: {
                    values: [25, 50, 75, 100]
                }
            }
        };

        let gauge = c3.generate(gaugeConfig);
    }

    render () {
        const gaugeClasses = classNames(
            this.props.className,
            'donut-chart-pf'
        );

        return (
            <div id={this.props.identifier} className={gaugeClasses}></div>
        );
    }
}

export default Gauge

/**
 * generate random ID if one is not supplied
 */
function generateId () {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < 5; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}

Gauge.propTypes = {
    className: propTypes.string,
    height: propTypes.number,
    identifier: propTypes.string,
    label: propTypes.string,
    value: propTypes.number,
    width: propTypes.number
};

Gauge.defaultProps = {
    height: 200,
    identifier: generateId(),
    width: 200
}
