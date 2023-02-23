import React, { Component } from 'react';  // u put the brackets when the import is not the default import of the component 
import { withRouter } from 'react-router-dom';
import { route } from '../_constants';
import { WithAuthorization } from '../_components';
import { compose } from 'recompose';
import Web3 from 'web3';
import { factoryAddress, factoryABI } from '../_constants';
import { connect } from 'react-redux';
import { fetchAddress } from '../_actions';
import { firebase } from '../firebase';

//the key value is used as dynamic key to allocate the actual value in the local state object
const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

const INITIAL_STATE = {
    walletAddress: '',
    error: null,
};

var ASSOCIATED_ADR = [];

class AccountWalletAddForm extends Component {
  componentDidMount() {
    this.props.dispatch(fetchAddress());
  }
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    event.preventDefault();
    const {
        walletAddress,
      } = this.state;

    let verifyUserABI = "";
    for(let item of factoryABI) {
        if(item.name === "verifyUser"){
          verifyUserABI = item;
        }
    }
    var user = firebase.auth.currentUser;
    if (user != null) {
      var web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/55b0d23db9bf4ef2b77e3eb471d4b326'));
      var dataToCallverify = web3.eth.abi.encodeFunctionCall(verifyUserABI, [web3.utils.fromAscii(user.email), walletAddress]);
      web3.eth.estimateGas({
        from: walletAddress,
        to: factoryAddress, 
        data: dataToCallverify,
      }).then((res, err) => {
                  if (res) {
                          // webservice part
                          this.setState(() => ({ ...INITIAL_STATE }));
                          this.props.history.push(
                          {
                            pathname: route.ACCOUNTWALLETVERIFY,
                            state: { wallet: walletAddress, factory: factoryAddress, amount: 0, gas: res, data: dataToCallverify }
                          });
                  }
                  if (err) {
                    console.log(err);
                  }
      }).catch(error => console.log(error));
    }


  }

  render() {
    const {
        walletAddress,
        error,
      } = this.state;

    const { address } = this.props;

    if(this.props.history.location.adr) {
      ASSOCIATED_ADR = this.props.history.location.adr;
    }
    else {
      ASSOCIATED_ADR = [];
      if (address.address) {
          address.address.forEach(element => {
            ASSOCIATED_ADR.push(element.addr);
          });
      }      
    }

    var isInvalid =
        walletAddress === '' ||
        Web3.utils.isAddress(walletAddress) == false || ASSOCIATED_ADR.includes(walletAddress) == true;
    
    return (
      <div>
        <h3>Add a wallet</h3>
        <form onSubmit={this.onSubmit}>
          <input
            value={walletAddress}
            onChange={event => this.setState(byPropKey('walletAddress', event.target.value))} //It is a higher order function which takes a key value and the actual value that is typed into the input field
            type="text"
            placeholder="your wallet address"
          />
          {Web3.utils.isAddress(walletAddress) == false ? (
            <div>Invalid Ethereum Address</div>
          ) : ( null)}

          {ASSOCIATED_ADR.includes(walletAddress) == true ? (
            <div>You Already Used this Ethereum Address </div>
          ) : ( null)}

          <button disabled={isInvalid} type="submit">
              Submit 
          </button>

          { error && <p>{error.message}</p> }
        </form>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  address: state.getIn(['addressState', 'items']), //state.addressState.items,
  loading: state.getIn(['addressState', 'loading']), //state.addressState.loading,
  error: state.getIn(['addressState', 'error']), //state.addressState.error
});


const authCondition = (authUser) => !!authUser; // make sure the user is authentified
const myAccountWalletAddPageWithRouter = withRouter(AccountWalletAddForm);
const AccountsWalletAddPageAuth = compose(
                                  WithAuthorization(authCondition),
                                  connect(mapStateToProps)
                                ) (myAccountWalletAddPageWithRouter);

export { AccountsWalletAddPageAuth as AccountsWalletAddPage };  