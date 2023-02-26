import React, { Component } from 'react';  // u put the brackets when the import is not the default import of the component 
import { Link, withRouter } from 'react-router-dom';
import { route } from '../_constants';
import { auth, db } from '../firebase';

//import { connect } from 'react-redux';
//import { userActions } from '../_actions';

const SignUpPage = ({ history }) =>
  <div>
    <h3>Sign Up</h3>
    <SignUpForm history={history} />
  </div>

const INITIAL_STATE = {
    username: '',
    email: '',
    passwordOne: '',
    passwordTwo: '',
    error: null,
};

//the key value is used as dynamic key to allocate the actual value in the local state object
const byPropKey = (propertyName, value) => () => ({
    [propertyName]: value,
});

class SignUpForm extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  callApi = async (aname, aemail, atoken) => {
    const response = await fetch('http://localhost:5000/api/user', {
      method: 'POST',
      body: JSON.stringify({
        name: aname,
        email: aemail,
        token: atoken,
      }),
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       }
    });
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);
    
    //console.log(body);
    return body;
  };

  onSubmit = (event) => {
    const {
        username,
        email,
        passwordOne,
      } = this.state;

    const {
        history,
    } = this.props;
  
    auth.doCreateUserWithEmailAndPassword(email, passwordOne)
        .then(authUser => {

          // Create a user in your own accessible Firebase Database too
          db.doCreateUser(authUser.user.uid, username, email)
            .then(() => {
              this.setState(() => ({ ...INITIAL_STATE }));
              history.push(route.MYPOOLS);

              this.callApi(username, email, authUser.user.uid)
                .then(res => console.log(res))
                .catch(err => console.log(err));

            })
            .catch(error => {
              this.setState(byPropKey('error', error));
            });
        })
        .catch(error => {
          this.setState(byPropKey('error', error));
        });
  
      event.preventDefault();

  }

  render() {
    const {
        username,
        email,
        passwordOne,
        passwordTwo,
        error,
      } = this.state;

    const isInvalid =
        passwordOne !== passwordTwo ||
        passwordOne === '' ||
        email === '' ||
        username === '';

    return (
      <form onSubmit={this.onSubmit}>
        <input
          value={username}
          onChange={event => this.setState(byPropKey('username', event.target.value))} //It is a higher order function which takes a key value and the actual value that is typed into the input field
          type="text"
          placeholder="Full Name"
        />
        <input
          value={email}
          onChange={event => this.setState(byPropKey('email', event.target.value))}
          type="text"
          placeholder="Email Address"
        />
        <input
          value={passwordOne}
          onChange={event => this.setState(byPropKey('passwordOne', event.target.value))}
          type="password"
          placeholder="Password"
        />
        <input
          value={passwordTwo}
          onChange={event => this.setState(byPropKey('passwordTwo', event.target.value))}
          type="password"
          placeholder="Confirm Password"
        />
        <button disabled={isInvalid} type="submit">
          Sign Up
        </button>

        { error && <p>{error.message}</p> }
      </form>
    );
  }
}

const SignUpLink = () =>
  <p>
    Don't have an account?
    {' '}
    <Link to={route.SIGN_UP}>Sign Up</Link>
  </p>
const RegisterPage = withRouter(SignUpPage);
export { RegisterPage };
// export { RegisterPage as RegisterPage };
export {
  SignUpForm,
  SignUpLink,
};