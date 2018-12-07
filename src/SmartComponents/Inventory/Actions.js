import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown, DropdownItem, DropdownPosition } from '../../PresentationalComponents/Dropdown';

class Actions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isCollapsed: true
        };
    }

    onToggle = (_event, collapsed) => {
        this.setState({ isCollapsed: collapsed });
    }

    onSelect = (event) => {
        event.stopPropagation();
        this.setState({ isCollapsed: true });
    }

    render() {
        return (
            <Dropdown
                isKebab
                position={ DropdownPosition.right }
                isCollapsed={ this.state.isCollapsed }
                title=""
                onSelect={ this.onSelect }
                onToggle={ this.onToggle }
            >
                <DropdownItem>First action</DropdownItem>
            </Dropdown>
        );
    }
}

Actions.propTypes = {
    item: PropTypes.shape({
        id: PropTypes.string
    })
};

export default Actions;
