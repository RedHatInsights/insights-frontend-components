import React, { Component } from 'react';
import PropTypes from 'prop-types';

class TableBody extends Component {
  constructor(props) {
    super(props);
    this.createRow = this.createRow.bind(this);
    this.createCol = this.createCol.bind(this);
  }
  createCol(col, rowKey, key) {
    let className = '';
    if (col.hasOwnProperty('title')) {
      className = col.className || className;
      col = col.title;
    }
    return (
      <td key={key}
        className={className}
        onClick={(event) => {
            this.props.onColClick && this.props.onColClick(event, rowKey, key);
          }
        }
      >
        {col}
      </td>
    )
  }

  createRow(oneRow, key) {
    return (
      <tr key={key} onClick={(event) => this.props.onRowClick && this.props.onRowClick(event, key)}>
        {this.props.hasCheckbox &&
          <td
            className="pf-c-table__check pf-m-shrink"
            onClick={event => {
                event.stopPropagation();
                this.props.onItemSelect && this.props.onItemSelect(event, key, !!!oneRow.selected)
              }
            }
          >
            <input
              checked={!!oneRow.selected}
              onChange={event => this.props.onItemSelect && this.props.onItemSelect(event, key, event.target.checked)}
              type="checkbox"
              className="pf-c-check"/>
          </td>
        }
        {oneRow &&
          oneRow.cells &&
          Object.keys(oneRow.cells).map((cellKey) => this.createCol(oneRow.cells[cellKey], key, cellKey))
        }
      </tr>
    )
  } 

  render() {
    const {
      className,
      rows,
      hasCheckbox,
      onItemSelect,
      onColClick,
      onRowClick,
      ...props
    } = this.props;
    console.log(rows);
    return (
      <tbody {...props}>
        {rows && Object.keys(rows).map((oneKey) => this.createRow(rows[oneKey], oneKey))}
      </tbody>
    )
  }
}

TableBody.propTypes = {
  hasCheckbox: PropTypes.bool,
  rows: PropTypes.any,
  onItemSelect: PropTypes.func,
  onColClick: PropTypes.func,
  onRowClick: PropTypes.func,
  className: PropTypes.string
}

export default TableBody;