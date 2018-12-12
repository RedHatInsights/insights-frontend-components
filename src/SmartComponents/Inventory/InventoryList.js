import React from 'react';
import { connect } from 'react-redux';
import InventoryEntityTable from './EntityTable';
import { Button } from '@patternfly/react-core';
import { loadEntities, filterEntities, showEntities } from '../../redux/actions/inventory';
import { SimpleTableFilter } from '../../PresentationalComponents/SimpleTableFilter';
import { Grid, GridItem } from '@patternfly/react-core';
import PropTypes from 'prop-types';
import './InventoryList.scss';
import { InventoryContext } from './Inventory';

class ContextInventoryList extends React.Component {
    constructor(props) {
        super(props);
    }

    filterEntities = (filterBy) => {
        this.props.filterEntities && this.props.filterEntities('display_name', filterBy);
    }

    loadEntities = (options) => {
        const { page, perPage } = this.props;
        this.props.loadEntities && this.props.loadEntities(
            this.props.items,
            {
                ...options || { page, per_page: perPage },
                prefix: this.props.pathPrefix,
                base: this.props.apiBase
            }
        );
    }

    componentDidMount() {
        const { setRefresh } = this.props;
        setRefresh && setRefresh(this.loadEntities);
        this.loadEntities();
    }

    render() {
        const { showHealth, entites } = this.props;
        return (
            <React.Fragment>
                <Grid guttter="sm" className="ins-inventory-list">
                    <GridItem span={ 12 }>
                        <InventoryEntityTable showHealth={ showHealth } />
                    </GridItem>
                </Grid>
            </React.Fragment>
        );
    }
}

const propTypes = {
    filterEntities: PropTypes.func,
    loadEntities: PropTypes.func,
    pathPrefix: PropTypes.number,
    apiBase: PropTypes.string,
    showHealth: PropTypes.bool,
    page: PropTypes.number,
    perPage: PropTypes.number,
    items: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.string),
        PropTypes.shape({
            id: PropTypes.string
        })
    ]),
    entites: PropTypes.arrayOf(PropTypes.any)
};

ContextInventoryList.propTypes = {
    ...propTypes,
    setRefresh: PropTypes.func
};

ContextInventoryList.defaultProps = {
    perPage: 50,
    page: 1
}

const InventoryList = ({ ...props }) => (
    <InventoryContext.Consumer>
        { ({ setRefresh }) => (
            <ContextInventoryList { ...props } setRefresh={ setRefresh } />
        ) }
    </InventoryContext.Consumer>
);

InventoryList.propTypes = propTypes;

function mapDispatchToProps(dispatch) {
    return {
        loadEntities: (items = [], config) => {
            const itemIds = items.reduce((acc, curr) => (
                [
                    ...acc,
                    typeof curr === 'string' ? curr : curr.id
                ]
            ), []);
            dispatch(loadEntities(itemIds, config));
            dispatch(showEntities(items.map(oneItem => (
                { ...typeof oneItem === 'string' ? { id: oneItem } : oneItem }
            ))));
        },
        filterEntities: (key = 'display_name', filterBy) => dispatch(filterEntities(key, filterBy))
    };
}

export default connect(
    ({entities: { page, per_page }}) => ({ page, perPage: per_page }),
    mapDispatchToProps
)(InventoryList);
