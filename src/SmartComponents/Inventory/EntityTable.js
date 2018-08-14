import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { SyncAltIcon, EllipsisVIcon } from '@patternfly/react-icons';
import { connect } from 'react-redux'
import { Table } from '../../PresentationalComponents/Table';

class EntityTable extends React.Component {
    static getDerivedStateFromProps(props, state) {
        const { loaded, entities, columns } = props;
        if (entities, columns, loaded) {
            return {
                ...state,
                header: columns.map(oneCell => oneCell.title),
                rows: entities.map(oneItem => ({
                    id: oneItem.id,
                    cells: columns.map(oneCell => oneItem[oneCell.key])
                }))
            }
        }
        return {
            ...state,
            rows: []
        }
    }
    constructor(props) {
        super(props);
        this.onRowClick = this.onRowClick.bind(this);
        this.onItemSelect = this.onItemSelect.bind(this);
        this.state = {
            header: [],
            rows: []
        };
    }

    onRowClick() {
        console.log('fff');
    }

    onItemSelect(event, key, checked) {
        const { rows } = this.state;
        rows.find(item => item.id === key).selected = checked;
        this.setState({
            rows
        });
    }

    render() {
        const { header, rows } = this.state;
        return <Table 
            header={header}
            onRowClick={this.onRowClick}
            onItemSelect={this.onItemSelect}
            hasCheckbox
            rows={rows}
        />
    }
}

EntityTable.propTypes = {
    loaded: PropTypes.bool,
    entities: PropTypes.array
};

EntityTable.defaultProps = {
    loaded: false
}

export default connect(({ entities }) => ({ ...entities }))(EntityTable);
