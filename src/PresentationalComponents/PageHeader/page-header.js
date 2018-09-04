import React from 'react';
import propTypes from 'prop-types';

import './page-header.scss';

/**
 * This is a page header that mimics the patternfly layout for a header section
 */

const PageHeader = ({className, ...props}) => {

    let pageHeaderClasses = classNames(
        className,
        'pf-l-page__main-section'
    );

    return (
        <section { ...props } className={ pageHeaderClasses }>
            <div className='pf-c-content'>
                {this.props.children}
            </div>
        </section>
    );
};

export default PageHeader;

PageHeader.propTypes = {
  children: propTypes.any.isRequired
};
