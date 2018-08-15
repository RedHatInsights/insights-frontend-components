import React from 'react';
import { Route, withRouter, Switch, Link } from 'react-router-dom';
import InventoryList from './InventoryList';
import InventoryDetail from './InventoryDetail';
import { entitiesReducer, entityDetailsReducer } from '../../redux/reducers/inventory';

const Inventory = ({ match }) => (
  <Switch>
    <Route exact path={match.path} component={InventoryList} />
    <Route path={`${match.path}/:id`} render={props => <InventoryDetail {...props} root={match.path} />} />
  </Switch>
);


export default withRouter((Inventory));

export function inventoryConnector(registerReducers) {
  return withRouter(Inventory)
}