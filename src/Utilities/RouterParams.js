import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

export default function(Component) {
  class RouterParams extends React.Component {
    componentDidMount () {
        const { match: {params, path}, onPathChange } = this.props;
        onPathChange && onPathChange({
          params,
          path
        });
    }

    componentDidUpdate (prevProps) {
      const { match: {params, path, url}, onPathChange } = this.props;
      if(url !== prevProps.match.url) {
        onPathChange && onPathChange({
          params,
          path
        });
      }
    }

    render () {
        return <Component {...this.props}/>;
    }
  };
  return withRouter(connect(() => ({}), (dispatch) => (
    {
      onPathChange: (data) => dispatch({
        type: '@@INSIGHTS-CORE/NAVIGATION',
        payload: data
      })
    }
  ))(RouterParams));
}
