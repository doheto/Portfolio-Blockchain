import React, { Component } from 'react';
import { WithAuthorization } from '../_components';
import { db } from '../firebase';
import { connect } from 'react-redux';
import { compose } from 'recompose';

class MyHomePage extends Component {
  componentDidMount() {
    const { onSetUsers } = this.props;

    db.onceGetUsers().then( (snapshot) =>
    { 
      onSetUsers(snapshot.val());
      console.dir(snapshot.val());
    }
    );
  }

  render() {
    const { users } = this.props;
    return (
      <div>
        <h1>Home</h1>
        <p>The Home Page is accessible by every signed in user.</p>

        { !!users && <UserList users={users} /> }
      </div>
    );
  }
}
const UserList = ({ users }) =>
  <div>
    <h2>List of Usernames of Users</h2>
    <p>(Saved on Sign Up in Firebase Database)</p>
    {/* {users[key].username} */}
    {Object.keys(users).map(key =>
      <div key={key}>{key}</div>
    )}
  </div>

const mapStateToProps = (state) => ({
  // users: state.userState.users,
    users: state.getIn(['userState', 'users']),
});

const mapDispatchToProps = (dispatch) => ({
  onSetUsers: (users) => dispatch({ type: 'USERS_SET', users }),
});

const authCondition = (authUser) => !!authUser;


const MyHomePageWithAuthorization = compose(
                                            WithAuthorization(authCondition),
                                            connect(mapStateToProps, mapDispatchToProps)
                                          ) (MyHomePage);

export { MyHomePageWithAuthorization as HomePage }; 