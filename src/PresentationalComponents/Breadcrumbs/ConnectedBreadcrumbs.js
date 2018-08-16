import React, { Component } from 'react';
import Breadcrumbs from './Breadcrumbs';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

class ConnectedBreadcrumbs extends Component {
  constructor(props) {
    super(props);
    this.onNavigate = this.onNavigate.bind(this);
  }

  onNavigate(_event, _item, key) {
    const { history } = this.props;
    history.go(-key);
  }

  render() {
    const {match, location, history, current, staticContext, dispatch, ...props} = this.props;
    return (
      <Breadcrumbs {...props}
        items={location.pathname.split('/').slice(2, -1).map(item => ({title: item, navigate: item}))}
        onNavigate={this.onNavigate}
        current={current && current}
      />
    )
  }
}

export default withRouter(ConnectedBreadcrumbs);