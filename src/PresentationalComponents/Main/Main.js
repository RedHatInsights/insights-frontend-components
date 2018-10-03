import React from 'react';
import propTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import ThemeContext from '../Dark/configContext';

/**
 * This is a component that wraps the page
 */

const Main = ({ className, children, params, path, ...props }) => {
    let mainClasses = classNames(
        className,
        'pf-l-page__main-section'
    );
    console.log(path && path.split('/'), 'fggg');
    return (
        <ThemeContext.Consumer>
            { theme => {

                let themeClasses = classNames(
                    { [`pf-m-${ theme }`]: theme  === 'dark' }
                );

                return (
                    <section { ...props } className={ `${ mainClasses } ${ themeClasses }` }>
                        { children }
                    </section>
                );
            } }
        </ThemeContext.Consumer>
    );
};

Main.propTypes = {
    className: propTypes.string,
    children: propTypes.any.isRequired
};

export default connect(({ routerData: { params, path }} = {}) => ({
    params,
    path
}), () => ({}))(Main);
