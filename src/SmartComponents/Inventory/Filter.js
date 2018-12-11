import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Grid, GridItem, Checkbox, Dropdown, DropdownToggle, DropdownItem } from '@patternfly/react-core';
import { SimpleTableFilter } from '../../PresentationalComponents/SimpleTableFilter';
import { connect } from 'react-redux';
import osVersion  from './filters/os-version';
import systemType from './filters/system-type';
import { filterSelect } from '../../redux/actions/inventory';

const buildFilterItem = ({ filter, pad = 0, isDisabled, onClick, ...props }) => (
    <DropdownItem
        {...props}
        data-value={filter.value}
        isDisabled={isDisabled}
        component="button"
        onClick={onClick}
        className={`ins-inventory-filter-${pad}`}
    >
        {
            !isDisabled &&
            <Fragment>
                <input
                    type="checkbox"
                    name={`filter-${filter.value}`}
                    className="pf-c-check__input"
                    checked={!!filter.selected || false}
                    onChange={_event => undefined}
                />
                <label className="pf-c-check__label" htmlFor={`filter-${filter.value}`}>{filter.title}</label>
            </Fragment>
        }
        {isDisabled && filter.title}
    </DropdownItem>
)

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
                },
            },
            ...subItems ? subItems.map(itemFilter => ({
                filter: calculateFilter(itemFilter),
                pad: 1
            })) : []
        ]))
    ]))
}

class Filter extends Component {
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
                filters[index].filter.selected = filters[key].filter.selected
            });
        }

        this.props.onFilterSelect({ item, selected: filters[key].filter.selected });
        this.setState({
            filters
        })
    }

    render() {
        const { columns, total, children } = this.props;
        const { filterByString, isOpen, filters } = this.state;
        return (
            <Grid guttter="sm" className="ins-inventory-filters">
                <GridItem span={4} className="ins-inventory-text-filter">
                    <SimpleTableFilter
                        options={{
                            items: columns && columns.map(column => ({
                                ...column,
                                value: column.key
                            }))
                        }}
                        onOptionSelect={this.onFilterByString}
                        onFilterChange={this.filterEntities}
                        placeholder={`Find system by ${filterByString}`}
                        buttonTitle=""
                    />
                </GridItem>
                <GridItem span={1} className="ins-inventory-filter">
                    <Dropdown
                        isOpen={isOpen}
                        dropdownItems={filters.map((item, key) => buildFilterItem({
                            ...item,
                            onClick: (event) => this.onFilterClick(event, item.filter, key)
                        }))}
                        toggle={<DropdownToggle onToggle={this.onToggle}>Filter</DropdownToggle>}
                    />
                </GridItem>
                <GridItem span={6}>
                    {children}
                </GridItem>
                <GridItem span={1} className="ins-inventory-total pf-u-display-flex pf-u-align-items-center">
                    <div>{total} results</div>
                </GridItem>
            </Grid>
        )
    }
}

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

function mapStateToProps({ entities: { columns, total, activeFilters } }) {
    return {
        columns,
        total,
        activeFilters
    }
}

function mapDispatchToProps(dispatch) {
    return {
        onFilterSelect: (filter) => dispatch(filterSelect(filter))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Filter)
