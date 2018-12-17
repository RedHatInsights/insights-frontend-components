import React from 'react';
import { connect } from 'react-redux';
import InventoryEntityTable from './EntityTable';
import { loadEntities, showEntities } from '../../redux/actions/inventory';
import { Grid, GridItem } from '@patternfly/react-core';
import PropTypes from 'prop-types';
import './InventoryList.scss';
import { InventoryContext } from './Inventory';
import debounce from 'lodash/debounce';

class ContextInventoryList extends React.Component {
    constructor(props) {
        super(props);
    }

    loadEntities = (options = {}, reload = true) => {
        const { page, perPage, onRefresh } = this.props;
        options = {
            page: options.page || page,
            // eslint-disable-next-line camelcase
            per_page: options.per_page || perPage,
            ...options
        };
        reload && onRefresh(options);
        this.props.loadEntities && this.props.loadEntities(
            this.props.items,
            {
                ...options,
                prefix: this.props.pathPrefix,
                base: this.props.apiBase
            }
        );
    }

    componentDidMount() {
        const { setRefresh, setUpdate } = this.props;
        setRefresh && setRefresh(this.loadEntities);
        setUpdate && setUpdate((options) => this.loadEntities(options, false));
        this.loadEntities();
    }

    render() {
        const { showHealth, ...props } = this.props;
        return (
            <React.Fragment>
                <Grid guttter="sm" className="ins-inventory-list">
                    <GridItem span={ 12 }>
                        <InventoryEntityTable {...props} showHealth={ showHealth } />
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
    onRefresh: PropTypes.func,
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
    page: 1,
    onRefresh: () => undefined
};

const InventoryList = ({ ...props }) => (
    <InventoryContext.Consumer>
        {({ setRefresh, setUpdate }) => (
            <ContextInventoryList {...props} setRefresh={ setRefresh } setUpdate={setUpdate } />
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
            ), []).filter(Boolean);
            dispatch(loadEntities(itemIds, config));
            dispatch(showEntities(items.map(oneItem => (
                { ...typeof oneItem === 'string' ? { id: oneItem } : oneItem }
            ))));
        }
    };
}

export default connect(
    ({ entities: { page, perPage }}) => ({ page, perPage }),
    mapDispatchToProps
)(InventoryList);
