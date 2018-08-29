import React, { Component } from 'react';
import propTypes from 'prop-types';
import * as c3 from 'c3';
import * as d3 from 'd3';
import classNames from 'classnames';

import './donut.scss';

/**
 * Donut used for displaying statuses
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

        let donut = c3.generate(donutConfig);

        /* eslint-disable */
        if (this.props.withLegend) {
            let id = [];
            let num = [];
            for (let i = 0; i < this.props.values.length; i++) { 
                id.push(this.props.values[i][0]);
                num.push(this.props.values[i][1]);
            }

            for (let i = 0; i < id.length; i++) { 
                d3.select('.ins-l-donut__legend').insert('div', '.donut').attr('class', 'ins-l-donut__legend--item').selectAll('div')
                    .data([id[i]])
                    .enter().append('div')
                    .attr('data-id', function(id) { return id; }).attr('class', 'badge-wrapper')
                    .html(function(id) {
                        return '<span class=\'badge\'></span>' + '<span class=\'badge__label\'>' + id + '</span>' + '<span class=\'badge__number\'> (' + num[i] + ') </span>'
                    })
                    .each(function(id) {
                        d3.select(this).select('span').style('background-color', donut.color(id));
                    })
                    .on('mouseover', function (id) {
                        donut.focus(id);
                    })
                    .on('mouseout', function (id) {
                        donut.revert();
                    })
            }
        }
        /* eslint-enable */
    }

    render () {

        const donutClasses = classNames(
            this.props.className,
            'ins-c-donut'
        );

        return (
            <React.Fragment>
                <div className='ins-l-donut'>
                    <div id={this.props.identifier} className={donutClasses}></div>
                    <div className='ins-c-donut-hole'>
                        <span className='ins-c-donut-hole--total__number'>{this.props.total}</span>
                        <span className='ins-c-donut-hole--total__label'>{this.props.totalLabel}</span>
                    </div>
                </div>
                <div className='ins-l-donut__legend'></div>
            </React.Fragment>
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
    totalLabel: propTypes.string,
    withLegend: propTypes.bool
};

Donut.defaultProps = {
    withLegend: false,
    height: 200,
    identifier: generateId(),
    width: 200
};
