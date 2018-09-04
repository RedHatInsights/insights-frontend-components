import React from 'react';
import propTypes from 'prop-types';

import './page-header.scss';

/**
 * This is a dumb component that only recieves properties from a smart component.
 * Dumb components are usually functions and not classes.
 *
 * @param props the props given by the smart component.
 */

class PageHeader extends React.Component {
  render () {
    return (
        <section className='pf-l-page__main-section pf-m-light'>
          <div className='pf-c-content'>
            {this.props.children}
          </div>
        </section>
    );
  }
};

export default PageHeader;

PageHeader.propTypes = {
  children: propTypes.any.isRequired
};
