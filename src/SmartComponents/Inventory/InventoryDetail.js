import React from 'react';
import { connect } from 'react-redux';
import { Button } from '@patternfly/react-core';
import { loadEntity } from '../../redux/actions/inventory';
import { withRouter, Link } from 'react-router-dom';
import Entitydetail from './EntityDetail';
import './InventoryDetail.scss';

class InventoryDetail extends React.Component {
  componentDidMount() {
    const { match: {params: {id}}, entity, loaded } = this.props;
    if(!entity || entity.id !== parseInt(id, 10) || !loaded) {
      this.props.loadEntity(parseInt(id, 10));
    }
  }

  render() {
    const { root } = this.props;
    return (
      <React.Fragment>
        <Entitydetail />
        <Link to={root}>
            <Button variant='primary'>Back</Button>
        </Link>
      </React.Fragment>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadEntity: (id) => dispatch(loadEntity(id))
  }
}

export default withRouter(connect(({ entityDetails: { entity, loaded } }) => ({entity, loaded}), mapDispatchToProps)(InventoryDetail))
