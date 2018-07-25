import React, { Component } from 'react';
import PropTypes from 'prop-types';

class TableBody extends Component {
  constructor(props) {
    super(props);
    this.createRow = this.createRow.bind(this);
    this.createCol = this.createCol.bind(this);
  }
  createCol(col, rowKey, key) {
    return (
      <td key={key} onClick={(event) => this.props.onColClick(event, rowKey, key)}>{col}</td>
    )
  }

  createRow(oneRow, key) {
    return (
      <tr key={key} onClick={(event) => this.props.onRowClick(event, key)}>
        {this.props.hasCheckbox &&
          <td
            className="ins-empty-col"
            onClick={event => this.props.onItemSelect && this.props.onItemSelect(event, key, !!!oneRow.selected)}
          >
            <input
              checked={!!oneRow.selected}
              type="checkbox"
              className="pf-c-check"/>
          </td>
        }
        {oneRow && oneRow.cells && oneRow.cells.map((col, cellKey) => this.createCol(col, key, cellKey))}
      </tr>
    )
  } 

  render() {
    const {
      children,
      className,
      rows,
      hasCheckbox,
      onItemSelect,
      ...props
    } = this.props;
    const onClickChildren = React.Children.map(
      children,
      child => React.cloneElement(child, { onclick: onColClick })
    );
    return (
      <tbody {...props}>
        {rows && rows.map(this.createRow)}
        {onClickChildren}
      </tbody>
    )
  }
}

TableBody.propTypes = {
  hasCheckbox: PropTypes.bool,
  rows: PropTypes.arrayOf(PropTypes.shape({cells: PropTypes.node, icon: PropTypes.node})),
  onItemSelect: PropTypes.func,
  onColClick: PropTypes.func,
  onRowClick: PropTypes.func,
  children: PropTypes.node,
  className: PropTypes.string
}

export default TableBody;