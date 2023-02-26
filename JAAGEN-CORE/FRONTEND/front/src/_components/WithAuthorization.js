import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { firebase } from '../firebase';
import { route } from '../_constants';

const MyWithAuthorization = (authCondition) => (Component) => {
  class WithAuthorization extends React.Component {
    componentDidMount() {
      firebase.auth.onAuthStateChanged(authUser => {
        if (!authCondition(authUser)) {
          this.props.history.push(route.SIGN_IN);
        }
      });
    }

    render() {
      return this.props.authUser ? <Component /> : null;
    }
  }

  const mapStateToProps = (state) => ({
    // authUser: state.sessionState.authUser,
    // .getIn(['my', 'nested', 'name']);
    authUser: state.getIn(['sessionState', 'authUser']),
  });

  return compose(
    withRouter,
    connect(mapStateToProps),
  )(WithAuthorization);
}

export { MyWithAuthorization as WithAuthorization } ;