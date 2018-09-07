import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AngleDownIcon } from '@patternfly/react-icons';
import { Button, ButtonVariant } from '@patternfly/react-core';
import classnames from 'classnames';

class TableBody extends Component {
  createCol(col, rowKey, key) {
    const { cols } = this.props;
    const current = Object.values(cols)[key];
    return (
      <td key={key}
        data-label={current.hasOwnProperty('title') ? current.title : current}
        role={this.props.expandable && 'gridcell'}
        className={classnames(col.className)}
        colSpan={col.colSpan}
        onClick={(event) => {
            this.props.onColClick && this.props.onColClick(event, rowKey, key);
          }
        }
      >
        {col.title || col}
      </td>
    )
  }

  createArrow(row, key) {
    return (
      <td className={classnames({
        'pf-c-table__toggle': true,
        'pf-m-shrink': true,
        'pf-m-expanded': row.active
        })
      }
      role="gridcell">
        <Button
          variant={ButtonVariant.plain}
          className="pf-m-toggle"
          onClick={event => this.props.onExpandClick && this.props.onExpandClick(event, row, key)}
        >
          {row.hasOwnProperty('children') && <AngleDownIcon />}
        </Button>
      </td>
    )
  }

  createRow(oneRow, key) {
    return (
      <tr key={key}
        className={classnames({
          'pf-c-table__expandable-row': oneRow.hasOwnProperty('isOpen'),
          'pf-m-expanded': oneRow.isOpen
        })}
        role={this.props.expandable && 'row'}
        aria-level={this.props.expandable && (oneRow.hasOwnProperty('isOpen')? 2 : 1)}
        onClick={(event) => this.props.onRowClick && this.props.onRowClick(event, key)}
        hidden={oneRow.hasOwnProperty('isOpen') && !oneRow.isOpen}
      >
        {this.props.expandable && this.createArrow(oneRow, key)}
        {this.props.hasCheckbox &&
          <td
            className="pf-c-table__check pf-m-shrink"
            role={this.props.expandable && 'gridcell'}
            onClick={event => {
                event.stopPropagation();
                this.props.onItemSelect && this.props.onItemSelect(event, key, !!!oneRow.selected)
              }
            }
          >
            {!oneRow.hasOwnProperty('isOpen') && <input
              checked={!!oneRow.selected}
              onChange={event => this.props.onItemSelect && this.props.onItemSelect(event, key, event.target.checked)}
              type="checkbox"
              className="pf-c-check"/>}
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
      expandable,
      onExpandClick,
      ...props
    } = this.props;
    return (
      <tbody {...props}>
        {rows && Object.keys(rows).map(
          (oneKey) => this.createRow(
            rows[oneKey],
            rows[oneKey].hasOwnProperty('id') ? rows[oneKey].id : oneKey
          )
        )}
      </tbody>
    )
  }
}

TableBody.propTypes = {
  expandable: PropTypes.bool,
  hasCheckbox: PropTypes.bool,
  rows: PropTypes.any,
  onItemSelect: PropTypes.func,
  onColClick: PropTypes.func,
  onRowClick: PropTypes.func,
  onExpandClick: PropTypes.func,
  className: PropTypes.string
}

export default TableBody;
