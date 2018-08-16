import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

function upperCaseFirst(item) 
{
    return item.charAt(0).toUpperCase() + item.slice(1);
}

const Breadcrumbs = ({items, current, className, onNavigate, ...props}) => (
  <React.Fragment>
    {items.length > 0 && <div {...props} className={classnames(className, 'ins-breadcrumbs')}>
      {items.map((oneLink, key) => (
        <React.Fragment>
          <a key={oneLink.navigate}
            onClick={event => onNavigate(event, oneLink.navigate, items.length - key)}>
            {upperCaseFirst(oneLink.title)}
          </a>
          <span>&nbsp;&gt;&nbsp;</span>
        </React.Fragment>
      )) }
      {current && <span>{upperCaseFirst(current)}</span>}
    </div> }
  </React.Fragment>
);

Breadcrumbs.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any),
  current: PropTypes.string,
  onNavigate: PropTypes.func
}

Breadcrumbs.defaultProps = {
  items: [],
  current: null,
  onNavigate: Function.prototype
}

export default Breadcrumbs;