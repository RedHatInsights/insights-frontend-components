import React from 'react';
import propTypes from 'prop-types';
import classNames from 'classnames';

import ThemeContext from '../Dark/configContext';

/**
 * This is a component that wraps the page
 */

const Main = ({ className, children, ...props }) => {

    let mainClasses = classNames(
        className,
        'pf-l-page__main-section'
    );

    return (
        <ThemeContext.Consumer>
            { theme => {

                let themeClasses = classNames(
                    { [`pf-m-${ theme }`]: theme  === 'dark' }
                );

                return {
                    dark: <section { ...props } className={ `${ mainClasses } ${ themeClasses }` }>
                        { React.Children.map(children, child => {
                            return React.cloneElement(child, {
                                className: 'pf-m-dark'
                            });
                        }) }
                    </section>,
                    light: <section { ...props } className={ mainClasses }>
                        { children }
                    </section>
                } [theme];
            } }
        </ThemeContext.Consumer>
    );
};

export default Main;

Main.propTypes = {
    className: propTypes.string,
    children: propTypes.any.isRequired
};
