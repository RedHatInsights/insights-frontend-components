import React from 'react';
import PropTypes from 'prop-types';
import { LabelsProp } from './Props';
const Labels = ({
  color,
  values: {xLabel, yLabel, subLabels: {xLabels: [xLow, xHigh], yLabels: [yLow, yHigh]}}, size, ...props}) => {
  return  (
    <g className="axis-labels">
      <text {...props} fill={color} textAnchor="middle" x={size / 4} y={size + 20}>{xHigh}</text>
      <text {...props} fill={color} textAnchor="middle" x={(size / 4) * 3} y={size + 20}>{xLow}</text>
      <text {...props} fill={color} textAnchor="middle" x={size / 2 + 8} y={size + 35} className="headline">{xLabel}</text>
      <text {...props} fill={color} textAnchor="middle" x="-10" y={size / 4}>{yHigh}</text>
      <text {...props} fill={color} textAnchor="middle" x="-10" y={(size / 4) * 3}>{yLow}</text>
      <text {...props} fill={color} textAnchor="middle" x="-20" y={size / 2 + 6} className="headline">{yLabel}</text>
    </g>
  )
};

Labels.propTypes = {
  size: PropTypes.number.isRequired,
  values: LabelsProp,
  color: PropTypes.string,
  children: PropTypes.node
}

Labels.defaultProps = {
  children: null,
  color: '#414241'
}

export default Labels;
