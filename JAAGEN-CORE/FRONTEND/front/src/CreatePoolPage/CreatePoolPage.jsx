import React, { Component } from 'react';  // u put the brackets when the import is not the default import of the component 
import { withRouter } from 'react-router-dom';
import { WithAuthorization } from '../_components';
import { compose } from 'recompose';
import Web3 from 'web3';
import { factoryAddress, factoryABI } from '../_constants';
import { connect } from 'react-redux';
import { fetchAddress } from '../_actions';
import { firebase } from '../firebase';
import CreatableSelect from 'react-select/lib/Creatable';
import {v1, v4 } from 'uuid';
import { Spinner, SpinnerService } from '@chevtek/react-spinners';
import * as axios from 'axios'; // replace with your preferred ajax request library

//the key value is used as dynamic key to allocate the actual value in the local state object
const byPropKey = (propertyName, value) => () => ({
    [propertyName]: value,
});

const yourCustomSpinnerService = new SpinnerService();

// address[4] managers, uint totalPoolValue, uint minAmountPerContributor, uint maxAmountPerContributor, bool isWhiteList, address destinationAddress, bytes dataField, uint managerFee, uint numberOfAutodistrib

var ASSOCIATED_ADR = [];

class CreatePoolForm extends Component {
    componentDidMount() {
        this.props.dispatch(fetchAddress());
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    
    constructor(props) {
        super(props);
        this.state = 
        { 
            walletAddress: '',
            netamount: 1000,
            yourfee: 0,
            totalplusfee: (1000 * (1.005)).toFixed(3),
            maxpercontributor: 50,
            minpercontributor: 0.15,
            autodropsnumber: 0,
            adminwalletAddress1: '',
            adminwalletAddress2: '',
            createwhitelist: false,
            destinationAddress: '',
            data: '',
            disclaimer: '',
            selectedaddress: '',
            error: null,
            progress: 1,
            gas: 0,
            dataToCreatePool:'',
            theui: '',
            spinnerwaiter: true,
            poollink: '',
        };
            // this.setState({ totalplusfee: (this.state.netamount * (1.005 + this.state.yourfee/100)).toFixed(2)});
    }
    

    handleSubmit = (event) => {
        event.preventDefault();
        this.setState({progress : 2});
        // const { thepoollink } = this.props;
        const {
            yourfee,
            selectedaddress,
            totalplusfee,
            maxpercontributor,
            minpercontributor,
            autodropsnumber,
            adminwalletAddress1,
            adminwalletAddress2,
            createwhitelist,
            destinationAddress,
            data,
        } = this.state;

        let createABI = "";
        for(let item of factoryABI) {
            if(item.name === "create"){
                createABI = item;
            }
        }

        var user = firebase.auth.currentUser;

        var managers = [];
        managers.push(selectedaddress.value);
        if (Web3.utils.isAddress(adminwalletAddress1)) {
            managers.push(adminwalletAddress1);
        }
        else {
            managers.push('0x0000000000000000000000000000000000000000');
        }
        if (Web3.utils.isAddress(adminwalletAddress2)) {
            managers.push(adminwalletAddress2);
        }
        else {
            managers.push('0x0000000000000000000000000000000000000000');
        }
        if (managers.length==3) {
            managers.push('0x0000000000000000000000000000000000000000');
        }
        var web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/55b0d23db9bf4ef2b77e3eb471d4b326'));
        var yourfeeNormalized = Math.floor(yourfee*100); 
        if (destinationAddress.length==0) {
            this.setState( byPropKey('destinationAddress', '0x0000000000000000000000000000000000000000' ), () => {
                console.log(this.state.destinationAddress);
            });
        }
        
        
        //lets form uint[4] allfees variable // allfees[0] = managerFee; // allfees[1] = serviceFeePercentage; *
                                            // allfees[2] = numberOfAutodistrib; // allfees[3] = feePerAutodistrib;*
        var allfees = [];
        allfees.push(Number(web3.utils.toBN(yourfeeNormalized))); // adding managerfee
        var MyContract = new web3.eth.Contract(factoryABI, factoryAddress);
        MyContract.methods.serviceFeePercentage.call().call((error, result) => {
            if (result) {
                allfees.push(Number(result)); // adding servicefeepercentage
                allfees.push(Number(autodropsnumber)); // adding numberOfAutodistrib
                MyContract.methods.feePerAutodistrib.call().call((error2, result2) => {
                    if (result2) {
                        allfees.push(web3.utils.fromWei(result2, 'finney')); // adding feePerAutodistrib
                        // setting the uniq id
                        this.setState( byPropKey('theui', v1()+v4() ), () => {
                            // console.log(this.state.theui);
                        });
                        // console.log(this.state.theui);
                        console.dir(allfees);
                                                                                            // string the, bytes32 mail,             address[4] managers, uint totalPoolValue, uint minAmountPerContributor, uint maxAmountPerContributor, bool isWhiteList, address destinationAddress, bytes dataField, uint[4] allfees
                        var dataToCallCreate = web3.eth.abi.encodeFunctionCall(createABI , [this.state.theui, web3.utils.fromAscii(user.email), managers, web3.utils.toWei(totalplusfee.toString()), web3.utils.toWei(minpercontributor.toString()), web3.utils.toWei(maxpercontributor.toString()), createwhitelist, this.state.destinationAddress, web3.utils.asciiToHex(data), allfees]);
                        this.setState(byPropKey('dataToCreatePool', dataToCallCreate), () => {
                            // console.log(`dataToCreatePool:`, this.state.dataToCreatePool);
                        });
                        web3.eth.estimateGas({
                            from: selectedaddress.value,
                            to: factoryAddress, 
                            data: dataToCallCreate,
                        }).then((res, err) => {
                                    if (res) {
                                        this.setState(byPropKey('gas', res), () => {
                                            //console.log("GAS TO USE " + this.state.gas + " RES " + res);
                                        });
                                    }
                                    if (err) {
                                        //console.log(err);
                                    }
                        }).catch(error => console.log(error));
                    }
                });
            }
        });
        


        console.dir(this.state.theui);

        yourCustomSpinnerService.show('poolwaiter');
        this.interval = setInterval(
            () =>
            {
                if (this.state.spinnerwaiter) {
                    axios.get('http://localhost:5000/api/pool/'.concat(this.state.theui))
                        .then(res => {
                            yourCustomSpinnerService.hide('poolwaiter');
                            // do stuff with res
                            // console.dir(res);
                            this.setState({progress : 3});
                            this.setState(byPropKey('spinnerwaiter', false), () => {
                                // console.log(this.state.theui);
                            });
                            this.setState(byPropKey('poollink', 'http://localhost:3000/pool/eth/'.concat(res.data.address)), () => {
                                // console.log(this.state.theui);
                            });

                        })
                        .catch(err => {
                            yourCustomSpinnerService.show('poolwaiter');
                            // log error
                            console.log("error spinner " + err);
                        })
                }
            }
            , 5000);
    }

    handleChange = (selectedaddress) => {
        this.setState({ selectedaddress });
        // console.log(`Option selected:`, selectedaddress);
    }
    //
    handleTotalAmountNetAmount = (newValue, actionMeta) => {
        this.setState( byPropKey('netamount', newValue.target.value), () => {
            //console.log(`new net amount:`, this.state.netamount);
            this.setState({ totalplusfee: (this.state.netamount * (1.005 + this.state.yourfee/100)).toFixed(2)});
            //console.log(`new net totalplusfee:`, this.state.totalplusfee);
        });
        
    }
    handleTotalAmountYourFee = (newValue, actionMeta) => {
        this.setState( byPropKey('yourfee', newValue.target.value), () => {
            // console.log(`new yourfee:`, this.state.yourfee);
            this.setState({ totalplusfee: (this.state.netamount * (1.005 + this.state.yourfee/100)).toFixed(2)});
            // console.log(`new net totalplusfee:`, this.state.totalplusfee);
        });
        
    }

    // handleInputChange = (inputValue, actionMeta) => {
    //     console.group('Input Changed');
    //     console.log(inputValue);
    //     console.log(`action: ${actionMeta.action}`);
    //     console.groupEnd();
    // }

    render() {
        const {
            netamount,
            yourfee,
            selectedaddress,
            totalplusfee,
            maxpercontributor,
            minpercontributor,
            autodropsnumber,
            adminwalletAddress1,
            adminwalletAddress2,
            createwhitelist,
            destinationAddress,
            data,
            disclaimer,
            error,
            progress,
            gas,
            dataToCreatePool,
            spinnerwaiter,
            poollink,
        } = this.state;

        const { address} = this.props;

        if (this.props.history.location.adr) {
            ASSOCIATED_ADR = this.props.history.location.adr;
        }
        else {
            ASSOCIATED_ADR = [];
            if (address.address) {
                address.address.forEach(element => {
                    ASSOCIATED_ADR.push({ value: element.addr, label: element.addr } );
                });
            }
        }

        var isNetAmountValid = netamount <= 0;
        var regexp = /^\d+(\.\d{1,2})?$/;
        var isYourFeeValid = yourfee < 0 || yourfee > 50 || !regexp.test(yourfee)  ;
        var isMaxPerContributorValid = maxpercontributor <= 0 || !regexp.test(maxpercontributor); //maxpercontributor > netamount ||
        var isMinGreaterThanMax = minpercontributor > maxpercontributor || !regexp.test(minpercontributor);
        var isMinAndNumberOfDropsValid = minpercontributor < 2*autodropsnumber*0.006;
        var isAutoDropNumberValid = autodropsnumber < 0 || autodropsnumber > 15 ;
        var isAdminAddressValid1 = adminwalletAddress1.length>0 && Web3.utils.isAddress(adminwalletAddress1) == false;
        var isAdminAddressValid2 = adminwalletAddress2.length>0 && Web3.utils.isAddress(adminwalletAddress2) == false;
        var isWalletAddressValid = selectedaddress.length<=0 || selectedaddress.length>0 && Web3.utils.isAddress(selectedaddress) == false;
        var isDestinationAddressValid = destinationAddress.length>0 && Web3.utils.isAddress(destinationAddress) == false;
        var isDataValid = data.length>0 && data.startsWith("0x") == false;

        var isInvalid = isNetAmountValid || isYourFeeValid || isMaxPerContributorValid || isMinGreaterThanMax ||
                        isMinAndNumberOfDropsValid || isAutoDropNumberValid || isAdminAddressValid1 || isAdminAddressValid2 ||
                        isDestinationAddressValid || isDataValid || isWalletAddressValid;

        if (progress==1) {
            return (
                <div>
                    <form onSubmit={this.handleSubmit}>
                        <h1>Create A Pool</h1>
                        <section>
                            <section>
                                <h2>Contribute With</h2>
                                <select name="FromBlockchain" >
                                    <option value="ethereum">Ethereum</option>
                                    <option value="ethereum">GoChain</option>
                                </select>
                            </section>
                            <section>
                                <h2>Receive tokens on</h2>
                                <select name="ToBlockchain" >
                                    <option value="ethereum">Ethereum</option>
                                    <option value="ethereum">GoChain</option>
                                </select>
                            </section>
                            <h2>Select Or Enter Your Ethereum Wallet</h2>
                            {/* onInputChange={this.handleInputChange} */}
                            <CreatableSelect  options={ASSOCIATED_ADR} 
                                            onChange={this.handleChange}
                                            value={selectedaddress} isClearable/>
                                    { isWalletAddressValid ? (
                                            <div>Select a valid address Or Enter a New Valid Address</div>
                                        ) : ( null)}
                        </section>

                        <section>
                            <h2>Allocations</h2>
                            <section>
                                <label >Net Amount  </label>
                                <input  value={netamount} 
                                        onChange={this.handleTotalAmountNetAmount}
                                        type="number" />   <label> ETH</label>
                                        { isNetAmountValid ? (
                                            <div>Must be greater than 0</div>
                                        ) : ( null)}
                                        {/* event => this.setState(byPropKey('netamount', event.target.value))*/}
                            </section>
                            <section>  
                                <label >Your fee </label>
                                <input value={yourfee} 
                                        onChange={this.handleTotalAmountYourFee} 
                                        type="number" max="50" min="0" size="10" type="number" step="0.01"/>
                                <label> % + PrimaBlock's fee (0.5%)</label>
                                { isYourFeeValid ? (
                                            <div>Must be between 0 and 50 And Must have A Maximum of 2 Decimals</div>
                                        ) : ( null)}
                                        {/* {event => this.setState(byPropKey('yourfee', event.target.value))} */}
                            </section>
                            <section>
                                <label >Total amount </label>
                                <input value={totalplusfee} 
                                        size="5" type="number" readOnly/>
                                <label> ETH</label>
                            </section>
                            <section>
                                <label >Maximum Per Contributor </label>
                                <input value={maxpercontributor} 
                                        onChange={event => this.setState(byPropKey('maxpercontributor', event.target.value))} 
                                        type="number" min="0" size="5" />
                                <label> ETH</label>
                                { isMaxPerContributorValid ? (
                                            <div>Must be greater than 0 and lower or equals to Net amount </div>
                                        ) : ( null)}
                            </section>
                            <section>
                                <label >Minimum Per Contributor </label>
                                <input value={minpercontributor} 
                                        onChange={event => this.setState(byPropKey('minpercontributor', event.target.value))} 
                                        min="0" size="5" type="number" step="0.01"/>
                                <label> ETH</label>
                                { isMinGreaterThanMax  ? (
                                            <div>Must be lower than maximum per contributor and valid number with 2 digits max</div>
                                        ) : ( null)}
                                { isMinAndNumberOfDropsValid  ? (
                                            <div>Minimum Contribution must be at least {(2*autodropsnumber*0.006).toFixed(3)} </div>
                                        ) : ( null)}
                            </section>
                        </section>

                        <section>
                            <h2>Options</h2>
                            <h3>Distribute tokens Automatically</h3>
                                <label>Number of token Drops</label> 
                                <input matinput="" max="15" min="0" size="4" type="number" 
                                    value={autodropsnumber}
                                    onChange={event => this.setState(byPropKey('autodropsnumber', event.target.value))}/>
                                    { isAutoDropNumberValid ? (
                                            <div>Must be between 0 and 15 </div>
                                        ) : ( null)}
                                    { isMinAndNumberOfDropsValid  ? (
                                            <div>Minimum Contribution must be at least {(2*autodropsnumber*0.006).toFixed(3)} </div>
                                        ) : ( null)}
                                    <div>Note that {(autodropsnumber*0.006).toFixed(3)} ETH per contributor will be deducted from the pool in order to pay for the gas costs required to deliver tokens or refund to your contributors. Distribution can take up to 24h to happen </div>
                            <h3>Extra admins</h3>
                                <label>Admin 1</label>
                                <input 
                                    value={adminwalletAddress1}
                                    onChange={event => this.setState(byPropKey('adminwalletAddress1', event.target.value))} 
                                    type="text"
                                    placeholder="admin 1 wallet address"
                                />
                                { isAdminAddressValid1 ? (
                                    <div>Invalid Ethereum Address</div>
                                ) : ( null)}
                                <label>Admin 2</label>
                                <input 
                                    value={adminwalletAddress2}
                                    onChange={event => this.setState(byPropKey('adminwalletAddress2', event.target.value))} 
                                    type="text"
                                    placeholder="admin 2 wallet address"
                                />
                                {isAdminAddressValid2 ? (
                                    <div>Invalid Ethereum Address</div>
                                ) : ( null)}
                                <h3>create Whitelist</h3>
                                    <label >
                                        <input type="checkbox" value={createwhitelist} />
                                    </label>
                                <h3>Lock Destination Address</h3>
                                    <label >Destination Address </label>
                                    <input 
                                        value={destinationAddress}
                                        onChange={event => this.setState(byPropKey('destinationAddress', event.target.value))}
                                        type="text"
                                    />
                                    {isDestinationAddressValid ? (
                                        <div>Invalid Ethereum Address</div>
                                    ) : ( null)}

                                    <label >Data (Optional) </label>
                                    <input 
                                        value={data}
                                        onChange={event => this.setState(byPropKey('data', event.target.value))}
                                        type="text"
                                    />
                                    { isDataValid ? (
                                        <div>Must be hexadecimal</div>
                                    ) : ( null)}
                                <h3>Add custom disclaimer</h3>
                                <input
                                        value={disclaimer}
                                        onChange={event => this.setState(byPropKey('disclaimer', event.target.value))}
                                        type="text"
                                    />
                                

                        </section>
                        
                        <button  type="submit" disabled={isInvalid} 
                            style= {
                                {
                                    borderRadius: '2px',
                                    width: '60px',
                                    border: 'solid 1px #d8dde3',
                                    backgroundColor: isInvalid ? '#FF0000' : '#0000FF',
                                }
                            } > 
                            Submit
                        </button>

                        {error && <p>{error.message}</p>}
                    </form>
                </div>
            );
        }
        else if(progress==2) {
            return (
                <div>
                    <h1>Create A Pool</h1>
                        <section>
                            <section>
                                <h2>Send a transaction</h2>
                                <br/> <br/>
                                <label > To perform this operation, you need to send a transaction from: </label>
                                <input size="50" readOnly type="text" defaultValue={selectedaddress.value} />
                            </section>
                            <section>
                                <label > Use your preferred wallet provider to send the transaction: </label>
                                <div>Metamask</div>
                                <div>MyCrypto</div>
                                <div>MyEtherWallet</div>
                            </section>
                            <section>
                                <label> Or manually send the transaction: </label>
                                <div>
                                    <label>To Address </label>
                                    <input size="50" readOnly type="text" defaultValue={factoryAddress} />
                                </div>
                                <div>
                                    <label>Gas Limit </label>
                                    <input size="50" readOnly value={gas} />
                                </div>
                                <div>
                                    <label>Data </label>
                                    <input size="50" readOnly type="text" defaultValue={dataToCreatePool} />
                                </div>
                            </section>
                            <section>
                                <div>
                                { spinnerwaiter ? (
                                        <Spinner  name="poolwaiter" spinnerService={yourCustomSpinnerService} loadingImage="/Users/GildasOswald/SMC/MySMC/frontend/src/_constants/loading.gif">  
                                            Loading...
                                        </Spinner>
                                    ) : 
                                    (null)
                                }

                                    
                                </div>
                            </section>
                        </section>
                </div>
            );
        }
        else if(progress==3) {
            return (
                <div>
                    <label>Congratulations the pool has been successfully created </label><br/>
                    <label>Here is the link for the pool : </label><br/>
                    <a href={poollink}>{poollink}</a>
                </div>
            );
        }
    }
}
const mapStateToProps = (state) => ({
    address: state.getIn(['addressState', 'items']), //state.addressState.items,
    loading: state.getIn(['addressState', 'loading']), //state.addressState.loading,
    error: state.getIn(['addressState', 'error']), //state.addressState.error,
});




const authCondition = (authUser) => !!authUser; // make sure the user is authentified
const myCreatePoolPageWithRouter = withRouter(CreatePoolForm);
const CreatePoolPageWithRouterAuth = compose(
    WithAuthorization(authCondition),
    connect(mapStateToProps)
)(myCreatePoolPageWithRouter);

export { CreatePoolPageWithRouterAuth as CreatePoolPage };  