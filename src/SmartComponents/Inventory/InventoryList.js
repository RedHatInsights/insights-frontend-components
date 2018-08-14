import React from 'react';
import { connect } from 'react-redux';
import InventoryEntityTable from './EntityTable';
import { Button } from '@patternfly/react-core';
import { loadEntities } from '../../redux/actions/inventory';
import './EntityTable.scss';

class InventoryList extends React.Component {
  componentDidMount() {
    this.props.loadEntities();
  }

  render() {
    return (
      <React.Fragment>
        <InventoryEntityTable />
        <div className='buttons'>
          <Button variant='primary' onClick={this.props.entites}>Refresh</Button>
        </div>
      </React.Fragment>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadEntities: () => dispatch(loadEntities())
  }
}

export default connect(() => ({}), mapDispatchToProps)(InventoryList)