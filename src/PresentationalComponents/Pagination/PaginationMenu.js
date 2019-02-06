import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CaretDownIcon, CaretUpIcon } from '@patternfly/react-icons';
import { Dropdown, DropdownItem, DropdownToggle } from '@patternfly/react-core';

class PaginationNav extends Component {
    state = {
        isOpen: false
    }

    onSelect = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    };

    onToggle = isOpen => {
        this.setState({
            isOpen
        });
    };

    render() {
        const {
            itemsTitle,
            itemsStart,
            itemsEnd,
            widtgetId,
            dropDirection,
            onSetPerPage,
            itemCount,
            perPageOptions,
            className,
            ...props
        } = this.props;
        const { isOpen } = this.state;
        return (
            <div className={ `pf-c-options-menu ${className}` } { ...props }>
                <span id={ `${widtgetId}-label` } hidden>Items per page:</span>
                <div className="pf-c-options-menu__toggle pf-m-text pf-m-plain">
                    <Dropdown direction={ dropDirection }
                        isPlain
                        isOpen={ isOpen }
                        onSelect={ this.onSelect }
                        dropdownItems={ perPageOptions.map(({ title, value }) => (
                            <DropdownItem onClick={ event => onSetPerPage(event, value) } key={ value } component="button">{ title }</DropdownItem>
                        )) }
                        toggle={
                            <DropdownToggle onToggle={ this.onToggle } iconComponent={ null } className="pf-c-options-menu__toggle-button">
                                <span className="pf-c-options-menu__toggle-text">
                                    <b>{ itemsStart } - { itemsEnd }</b> of <b>{ itemCount }</b> { itemsTitle }
                                </span>
                                { dropDirection === 'up' ? <CaretUpIcon /> : <CaretDownIcon /> }
                            </DropdownToggle>
                        }
                    />
                </div>
            </div>
        );
    }
}

PaginationNav.propTypes = {
    itemsTitle: PropTypes.string,
    itemsStart: PropTypes.number,
    itemsEnd: PropTypes.number,
    dropDirection: PropTypes.string,
    widtgetId: PropTypes.string,
    onSetPerPage: PropTypes.func,
    itemCount: PropTypes.number.isRequired,
    perPageOptions: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.node,
        value: PropTypes.number
    }))
};

PaginationNav.defaultProps = {
    itemsTitle: 'items',
    dropDirection: 'up'
};

export default PaginationNav;
