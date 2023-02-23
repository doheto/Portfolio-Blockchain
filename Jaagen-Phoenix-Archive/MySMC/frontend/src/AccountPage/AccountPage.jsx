import React from 'react';

import { PasswordForgetForm } from '../PasswordForgetPage';
import { PasswordChangeForm } from '../PasswordChange';
import { WithAuthorization } from '../_components';

import { connect } from 'react-redux';
import { compose } from 'recompose';

const MyAccountPage = ({ authUser }) =>
    <div>
      <h1>Account: {authUser.email}</h1>
      <PasswordForgetForm />
      <PasswordChangeForm />
    </div>

const mapStateToProps = (state) => ({
  authUser: state.getIn(['sessionState', 'authUser']), //state.sessionState.authUser,
});

const authCondition = (authUser) => !!authUser;

const MyAccountPageWithAuthorization = compose(
  WithAuthorization(authCondition),
  connect(mapStateToProps)
)(MyAccountPage);

export { MyAccountPageWithAuthorization as AccountPage };

