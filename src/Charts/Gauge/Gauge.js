import React, { Component } from 'react';
import propTypes from 'prop-types';
import * as c3 from 'c3';

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
                width: 250
            },
            legend: {
                show: false
            },
            gauge: {
                fullCircle: true,
                label: {
                    show: false
                },
                width: 10
            }
        };

        let gauge = c3.generate(gaugeConfig);
    }

    render () {
        return (
            <div id={this.props.identifier} className='donut-chart-pf'></div>
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
    label: propTypes.string,
    value: propTypes.number,
    identifier: propTypes.string
};

Gauge.defaultProps = {
    identifier: generateId()
}
