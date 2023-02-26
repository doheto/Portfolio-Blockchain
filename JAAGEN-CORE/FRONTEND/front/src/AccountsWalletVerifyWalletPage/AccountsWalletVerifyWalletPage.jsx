import React, { Component } from 'react';  // u put the brackets when the import is not the default import of the component 
import { withRouter } from 'react-router-dom';
import { WithAuthorization } from '../_components';
import { compose } from 'recompose';

const myAccountsWalletVerifyWalletPage = ({ history }) =>
  <div>
    <h3>To ensure that your are the owner of the wallet, choose how you want to verify it:</h3>
    <AccountsWalletVerifyWalletForm history={history} />
  </div>

//console.log(history.location.state.detail);

const INITIAL_STATE = {
    // walletAddress: '',
    // toAddress: '',
    // amountToSend: '',
    // gasLimit: '',
    // data: '',
};

class AccountsWalletVerifyWalletForm extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  render() {
    const {
        walletAddress=this.props.history.location.state.wallet,
        toAddress=this.props.history.location.state.factory,
        amountToSend=this.props.history.location.state.amount,
        gasLimit=this.props.history.location.state.gas,
        data=this.props.history.location.state.data,
      } = this.state;

    return (
      <form>
        <section>
          <label>From Address    </label>
          <input
            size="50"
            readOnly
            defaultValue={walletAddress}
            type="text"
          />
        </section>
        <section>
          <label >To  Address    </label>
          <input
            size="50"
            readOnly
            defaultValue={toAddress}
            type="text"
          />
        </section>
        <section>
          <label >Amount to Send    </label>
          <input
            size="50"
            readOnly
            defaultValue={amountToSend}
            type="text"
          />
        </section>
        <section>
          <label>Gas Limit    </label>
          <input
            size="50"
            readOnly
            defaultValue={gasLimit}
            type="text"
          />
        </section>
        <section>
          <label>Data    </label>
          <input
            size="50"
            readOnly
            defaultValue={data}
            type="text"
          />
        </section>
      </form>
    );
  }
}

const authCondition = (authUser) => !!authUser; // make sure the user is authentified
const myAccountsWalletVerifyWalletPageWithRouter = withRouter(myAccountsWalletVerifyWalletPage);

const AccountsWalletVerifyWalletPageAuth = compose(
    WithAuthorization(authCondition),
  ) (myAccountsWalletVerifyWalletPageWithRouter);
export { AccountsWalletVerifyWalletPageAuth as AccountsWalletVerifyWalletPage };