import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { SortDirection } from './Table';
import { AngleDownIcon, AngleUpIcon, SortIcon } from '@patternfly/react-icons';

class TableHeader extends Component {
  constructor(props) {
    super(props);
    this.createCheckbox = this.createCheckbox.bind(this);
    this.createHeader = this.createHeader.bind(this);
    this.onDirectionClick = this.onDirectionClick.bind(this);
    this.onHeadClick = this.onHeadClick.bind(this);
  }

  onHeadClick(event, key) {
    let direction;
    if (this.props.sortBy.index === key) {
      direction = this.props.sortBy &&
      this.props.sortBy.direction === SortDirection.up ?
      SortDirection.down :
      SortDirection.up;
    } else {
      direction = SortDirection.up;
    }
    this.props.onSort && this.props.onSort(event, key, direction);
  }

  onDirectionClick(event, key, direction) {
    event.stopPropagation();
    if (key === this.props.sortBy.index) {
      direction = direction === SortDirection.up ? SortDirection.down : SortDirection.up;
    }
    this.props.onSort && this.props.onSort(event, key, direction);
  }

  createIcon(key) {
    const { sortBy } = this.props;
    if(sortBy.index === key) {
      return <AngleUpIcon onClick={event => this.onDirectionClick(event, key, sortBy.direction)} />;
    } else {
      return <SortIcon onClick={event => this.onDirectionClick(event, key, SortDirection.up)} />;
    }
  }

  renderCol(col, key, hasSort = true) {
    return (
      <React.Fragment>
        {col}
        {hasSort && col && <span className="pf-c-table__sort-indicator">
            {this.createIcon(key, SortDirection.up)}
          </span>
        }
      </React.Fragment>
    )
  }

  createHeader(col, key) {
    const {
      sortBy
    } = this.props;
    const classes = classnames(
      {
        'pf-c-table__sort': col.hasOwnProperty('hasSort') ? col.hasSort : true,
        'pf-m-blank': !col,
        'pf-m-ascending': sortBy.index === key && SortDirection.up === sortBy.direction,
        'pf-m-descending': sortBy.index === key && SortDirection.down === sortBy.direction
      }
    )
    return (
      <th key={key} className={classes} onClick={event => this.onHeadClick(event, key)}>
        {col}
        <span className="ins-sort-icons">
          {this.createIcon(key, SortDirection.up, AngleUpIcon)}
          {this.createIcon(key, SortDirection.down, AngleDownIcon)}
        </span>
      </th>
    )
  }

  createCheckbox() {
    const { onSelectAll } = this.props;
    return (
      <th className='pf-c-table__check pf-m-shrink' onClick={event => {
        const checkbox = event.target.querySelector('input') || event.target;
        if (checkbox !== event.target) {
          checkbox.checked = !checkbox.checked;
        }
        onSelectAll(event, checkbox.checked);
      }}>
        <input
              type="checkbox"
              className="pf-c-check"/>
      </th>
    )
  }

  render() {
    const {
      className,
      onSort,
      sortBy,
      cols,
      hasIcon,
      hasCheckbox,
      onSelectAll,
      ...props
    } = this.props;

    return (
      <thead {...props} className={classnames(className)}>
        <tr>
          {hasCheckbox && this.createCheckbox()}
          {hasIcon && <th className='ins-empty-col'/>}
          {cols && cols.map(this.createHeader)}
        </tr>
      </thead>
    );
  }
}

TableHeader.propTypes = {
  hasCheckbox: PropTypes.bool,
  hasIcon: PropTypes.bool,
  sortBy: PropTypes.shape({
    index: PropTypes.number,
    direction: PropTypes.oneOf(['up', 'down'])
  }),
  className: PropTypes.string,
  cols: PropTypes.arrayOf(PropTypes.node),
  onSelectAll: PropTypes.func,
  onSort: PropTypes.func
}

export default TableHeader;