import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { selectEntity, setSort } from '../../redux/actions/inventory';
import { connect } from 'react-redux'
import { Table } from '../../PresentationalComponents/Table';
import keyBy from 'lodash/keyBy';
import mapValues from 'lodash/mapValues';
import TableActions from './Actions';
import HealthStatus from './HealthStatus';
import get from 'lodash/get';

class EntityTable extends React.Component {
    constructor(props) {
        super(props);
        this.onRowClick = this.onRowClick.bind(this);
        this.onItemSelect = this.onItemSelect.bind(this);
        this.onSort = this.onSort.bind(this);
        this.state = {
            sortBy: {}
        }
    }

    onRowClick(_event, key) {
        const { match: {path}, history } = this.props;
        history.push(`${path}/${key}`);
    }

    onItemSelect(event, key, checked) {
        this.props.selectEntity && this.props.selectEntity(key, checked);
    }

    onSort(event, key, direction) {
        if (key !== 'action' && key !== 'health') {
            this.props.setSort && this.props.setSort(key, direction);
            this.setState({
                sortBy: {
                    index: key,
                    direction
                }
            })
        }
    }

    renderCol(col, key, composed) {
        if(composed) {
            return (
                <div className="ins-composed-col">
                    {composed.map(path => (
                        <div key={path}>
                            {get(col, path, 'unknown')}
                        </div>
                    ))}
                </div>
            )
        }
        return get(col, key, 'unknown');
    }

    render() {
        const { columns, entities, rows } = this.props;
        const filteredData = entities || rows;
        return <Table
            sortBy={this.state.sortBy}
            header={columns && {
                ...mapValues(keyBy(columns, item => item.key), item => item.title),
                health: {
                    title: 'Health',
                    hasSort: false
                },
                action: ''
            }}
            onSort={this.onSort}
            onRowClick={this.onRowClick}
            onItemSelect={this.onItemSelect}
            hasCheckbox
            rows={filteredData && filteredData.map(oneItem => ({
                id: oneItem.id,
                selected: oneItem.selected,
                cells: [
                    ...columns.map(oneCell => this.renderCol(oneItem, oneCell.key, oneCell.composed)),
                    <HealthStatus items={oneItem.health} className="ins-health-status"/>,
                    <TableActions item={{id: oneItem.id}} />
                ]
            }))}
        />
    }
}

EntityTable.propTypes = {
    loaded: PropTypes.bool,
    entities: PropTypes.array,
    selectEntity: PropTypes.func
};

EntityTable.defaultProps = {
    loaded: false,
    columns: [],
    entities: null,
    selectEntity: () => undefined
}

function mapDispatchToProps(dispatch) {
    return {
        selectEntity: (id, isSelected) => dispatch(selectEntity(id, isSelected)),
        setSort: (id, isSelected) => dispatch(setSort(id, isSelected))
    }
}

function mapStateToProps({entities: {columns, entities, rows, loaded}}) {
    return {
        entities,
        columns,
        loaded,
        rows
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EntityTable));
