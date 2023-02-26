import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { route } from '../_constants';
import { SignOutButton } from '../_components';


const NavigationPlan = ({ authUser }) =>
  <div>
    {authUser
      ? <NavigationAuth />
      : <NavigationNonAuth />
    }
  </div>

const NavigationAuth = () =>
  <ul>
    <li><Link to={route.MYPOOLS}>My Pools</Link></li>
    <li><Link to={route.ACCOUNTWALLET}>My Wallets</Link></li>
    <li><Link to={route.ACCOUNT}>My Account</Link></li>
    <li><Link to={route.LANDING}>Landing</Link></li>
    <li><Link to={route.SETTINGS}>Settings</Link></li>
    <li><Link to={route.HOME}>Home</Link></li>
    <li><SignOutButton /></li>
  </ul>

const NavigationNonAuth = () =>
  <ul>
    <li><Link to={route.LANDING}>Landing</Link></li>
    <li><Link to={route.SIGN_IN}>Sign In</Link></li>
  </ul>

const mapStateToProps = (state) => ({
  // authUser: state.sessionState.authUser,
  authUser: state.getIn(['sessionState', 'authUser']),
});

const NacvConnect =  connect(mapStateToProps)(NavigationPlan);

export { NacvConnect as Navigation };


