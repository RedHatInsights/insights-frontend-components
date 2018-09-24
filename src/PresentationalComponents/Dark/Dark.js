import React from 'react';
import propTypes from 'prop-types';

import ThemeContext from './configContext';

class Dark extends React.Component {
    render() {
        return (
            <ThemeContext.Provider value='dark'>
                { this.props.children }
            </ThemeContext.Provider>
        );
    }
}

export default Dark;

Dark.propTypes = {
    children: propTypes.node
};
