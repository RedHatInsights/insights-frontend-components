import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, GridItem, Button, Dropdown, DropdownToggle } from '@patternfly/react-core';
import { SimpleTableFilter } from '../../../PresentationalComponents/SimpleTableFilter';
import { connect } from 'react-redux';
import osVersion  from './filters/os-version';
import systemType from './filters/system-type';
import { filterSelect } from '../../../redux/actions/inventory';
import { SyncAltIcon } from '@patternfly/react-icons';
import { InventoryContext } from '../Inventory';
import FilterItem from './FilterItem';

function generateFilters(filters = [], activeFilters) {
    const calculateFilter = (filter) => ({
        ...filter,
        selected: !!activeFilters.find(item => item.value === filter.value)
    });

    return [
        ...filters,
        systemType,
        osVersion
    ].flatMap(({ items, ...filter }) => ([
        {
            filter,
            isDisabled: true
        },
        ...items.flatMap(({ items: subItems, ...subFilter }) => ([
            {
                filter: {
                    ...calculateFilter(subFilter),
                    items: subItems
                }
            },
            ...subItems ? subItems.map(itemFilter => ({
                filter: calculateFilter(itemFilter),
                pad: 1
            })) : []
        ]))
    ]));
}

class ContextFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filterByString: '',
            isOpen: false,
            filters: []
        };
    }

    componentDidMount() {
        this.setState({
            filters: generateFilters(this.props.filters, this.props.activeFilters)
        });
    }

    onFilterByString = (_event, selected) => {
        this.setState({
            filterByString: selected.title
        });
    }

    onToggle = isOpen => {
        this.setState({
            isOpen
        });
    };

    onFilterClick = (_event, { selected, ...item }, key) => {
        const { filters } = this.state;
        const values = filters.map(({ filter }) => filter.value);
        filters[key].filter.selected = !filters[key].filter.selected;

        if (item.hasOwnProperty('items') && item.items) {
            item.items.forEach(subItem => {
                const index = values.indexOf(subItem.value);
                filters[index].filter.selected = filters[key].filter.selected;
            });
        }

        this.props.onFilterSelect({ item, selected: filters[key].filter.selected });
        this.setState({
            filters
        });
    }

    render() {
        const { columns, total, children, onRefreshData } = this.props;
        const { filterByString, isOpen, filters } = this.state;
        return (
            <Grid guttter="sm" className="ins-inventory-filters">
                <GridItem span={ 4 } className="ins-inventory-text-filter">
                    <SimpleTableFilter
                        options={ {
                            items: columns && columns.map(column => ({
                                ...column,
                                value: column.key
                            }))
                        } }
                        onOptionSelect={ this.onFilterByString }
                        onFilterChange={ this.filterEntities }
                        placeholder={ `Find system by ${filterByString}` }
                        buttonTitle=""
                    />
                </GridItem>
                <GridItem span={ 1 } className="ins-inventory-filter">
                    <Dropdown
                        isOpen={ isOpen }
                        dropdownItems={ filters.map((item, key) => (
                            <FilterItem
                                { ...item }
                                key={ key }
                                data-key={ key }
                                onClick={ (event) => this.onFilterClick(event, item.filter, key) }
                            />
                        )) }
                        toggle={ <DropdownToggle onToggle={ this.onToggle }>Filter</DropdownToggle> }
                    />
                </GridItem>
                <GridItem span={ 6 }>
                    { children }
                </GridItem>
                <GridItem span={ 1 } className="ins-inventory-total pf-u-display-flex pf-u-align-items-center">
                    { total && <div>{ total } results</div> }
                    <Button
                        variant="plain"
                        className="ins-refresh"
                        title="Refresh"
                        aria-label="Refresh"
                        onClick={ onRefreshData }
                    >
                        <SyncAltIcon />
                    </Button>
                </GridItem>
            </Grid>
        );
    }
}

const Filter = ({ ...props }) => (
    <InventoryContext.Consumer>
        { ({ onRefreshData }) => (
            <ContextFilter { ...props } onRefreshData={ _event => onRefreshData() } />
        ) }
    </InventoryContext.Consumer>
);

Filter.propTypes = {
    filters: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.string,
        value: PropTypes.string,
        items: PropTypes.arrayOf(PropTypes.shape({
            title: PropTypes.string,
            value: PropTypes.string,
            items: PropTypes.arrayOf(PropTypes.shape({
                title: PropTypes.string,
                value: PropTypes.string
            }))
        }))
    })),
    activeFilters: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.string,
        value: PropTypes.string
    }))
};
Filter.defaultProps = {
    filters: [],
    activeFilters: []
};

function mapStateToProps({ entities: { columns, total, activeFilters }}) {
    return {
        columns,
        total,
        activeFilters
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onFilterSelect: (filter) => dispatch(filterSelect(filter))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Filter);
