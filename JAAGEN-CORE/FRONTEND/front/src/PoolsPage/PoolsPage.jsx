import React, { Component } from 'react';
import { WithAuthorization } from '../_components';
import { fetchAddress } from '../_actions';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { route } from '../_constants';
import * as Cookies from "js-cookie";

class MyPoolsPage extends Component {
  componentDidMount() {
    this.props.dispatch(fetchAddress());
    //const { onSetUsers } = this.props;

    // getting here the users
    // db.onceGetUsers().then(snapshot =>
    //   onSetUsers(snapshot.val())
    // );
  }

  render() {
    
    // checking if there is a cookie
    // if there is a cookie then we delete the cookie and reset it
    Cookies.remove('default.wallets.com.smc.wwww');
    //setting cookies 
    if (this.props.address.address && this.props.address.address.length>0) {
      Cookies.set('default.wallets.com.smc.wwww',this.props.address.address[0].addr);
    }
    // if (this.props.address.get('address') && this.props.address.get('address').length>0) {
    //   Cookies.set('default.wallets.com.smc.wwww',this.props.address.get('address')[0].addr);
    // }

    // what do you wanna manage state of ? 
    // const { mycontributions } = this.props;
    // const { mycreations } = this.props;
    

    // Your displayed html
    return (
      //#region HTML CODE
      <div>
        <main >
          <div >
            <div >
              <div  >
                <p > You can add wallets to your account to find the pools you contributed to and created. </p>
                <app-button-set  >
                  <app-styled-button  >
                    <a  routerlink={route.ACCOUNTWALLET} href={route.ACCOUNTWALLET}>
                      <button  >
                        <span >
                          <span >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                              <path d="M0 0h24v24H0z" fill="none"></path>
                              <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"></path>
                            </svg>
                          </span> My Wallets 
                        </span>
                        <div ></div>
                        <div ></div>
                      </button>
                    </a>
                  </app-styled-button>
                </app-button-set>
              </div>
              <div  >
                <p > Or create a new pool! </p>
                <app-button-set  >
                  <app-styled-button  >
                    <a  routerlink={route.CREATEPOOL} href={route.CREATEPOOL}>
                      <button  >
                        <span >
                          <span >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                              <path fill="currentcolor"  d="M0 0v18.855h11.195l-.59 2.973-.267 1.258 1.259-.267 3.026-.59.268-.053 8.356-8.356a2.597 2.597 0 0 0 0-3.643 2.572 2.572 0 0 0-1.821-.75c-.295 0-.576.06-.857.161V0H0zm1.714 1.714h17.14v1.714H1.715V1.714zm0 3.428h17.14v5.785l-6.213 6.214H1.714V5.142zm2.571 2.571v1.714H6V7.713H4.285zm3.428 0v1.714h8.57V7.713h-8.57zm-3.428 3.428v1.715H6V11.14H4.285zm3.428 0v1.715h5.143V11.14H7.713zm13.713 0c.218 0 .445.07.616.242a.837.837 0 0 1 0 1.205l-8.008 8.008-1.527.321.322-1.527 8.008-8.007a.801.801 0 0 1 .589-.242z"></path>
                            </svg>
                          </span> Create a Pool 
                        </span>
                        <div  matripple=""></div>
                        <div ></div>
                      </button>
                    </a>
                  </app-styled-button>
                </app-button-set>
              </div>
            </div>
            <h2 >
              <b >My Pools</b>
            </h2>
            <mat-tab-group  >
              <mat-tab-header >
                <div >
                  <div ></div>
                </div>
                <div >
                  <div >
                    <div >
                      <div  mat-ripple="" mattablabelwrapper="" role="tab" id="mat-tab-label-2-0" aria-posinset="1" aria-setsize="2" aria-controls="mat-tab-content-2-0" aria-selected="true">
                        <div >Contributor</div>
                      </div>
                      <div  mat-ripple="" mattablabelwrapper="" role="tab" id="mat-tab-label-2-1" aria-posinset="2" aria-setsize="2" aria-controls="mat-tab-content-2-1" aria-selected="false">
                        <div >Creator</div>
                      </div>
                    </div>
                    <mat-ink-bar ></mat-ink-bar>
                  </div>
                </div>
                <div aria-hidden="true"  mat-ripple="">
                  <div ></div>
                </div>
              </mat-tab-header>
              <div >
                <mat-tab-body role="tabpanel" id="mat-tab-content-2-0" aria-labelledby="mat-tab-label-2-0">
                  <div >
                    <div>
                      <table  matsort="">
                        <thead >
                        <tr>
                          <th  mat-sort-header="address" >
                            <div >
                              <button type="button" > Contract Address </button>
                              <div >
                                <div ></div>
                                <div  >
                                  <div ></div>
                                  <div ></div>
                                  <div ></div>
                                </div>
                              </div>
                            </div>
                          </th>
                          </tr>
                          <tr>
                          <th  mat-sort-header="status" >
                          <div >
                            <button type="button" aria-label="Change sorting for status"> Status </button>
                            <div >
                              <div ></div>
                              <div  >
                                <div  ></div>
                                <div ></div>
                                <div ></div>
                              </div>
                            </div>
                          </div>
                        </th>
                        </tr>
                        <tr>
                        <th  mat-sort-header="contribution" >
                          <div >
                            <button type="button" aria-label="Change sorting for contribution"> Contribution </button>
                            <div >
                              <div ></div>
                              <div  >
                                <div  ></div>
                                <div ></div>
                                <div ></div>
                              </div>
                            </div>
                          </div>
                        </th>
                        </tr>
                        <tr>
                        <th  mat-sort-header="token" >
                          <div >
                            <button type="button" aria-label="Change sorting for token"> Token </button>
                            <div >
                              <div ></div>
                              <div  >
                                <div  ></div>
                                <div ></div>
                                <div ></div>
                              </div>
                            </div>
                          </div>
                        </th>
                        </tr>
                        <tr>
                        <th ></th>
                        </tr>
                      </thead>
                      <tbody >

                        {/* { !!mycontributions && <MyContributionsList mycontributions={mycontributions} /> }                         */}
                                                
                      </tbody>
                    </table>
                  </div>
                </div>
              </mat-tab-body>
              <mat-tab-body role="tabpanel" id="mat-tab-content-2-1" aria-labelledby="mat-tab-label-2-1">
                <div />
              </mat-tab-body>
            </div>
          </mat-tab-group>
          </div>
        </main>
      </div>
      //#endregion HTML CODE
    );
  }
}

//#region somme comment 
// here we have the list of pools you participated in and those you created
//const MyContributionsList = ({ mycontributions }) =>
  //{Object.keys(mycontributions).map(key =>
    // <div key={key}>{mycontributions[key].username}</div>
    // <tr >
    //   <td  class="">
    //     <a  href="/p/StwoiGTd1Mg/contributor?wallet=0x443c7cd6e81dbe8a208203c716c00d4f359b10cc"> 0xc22188ad035ba123e7a22c51b2fabc2523d6361c </a>
    //   </td>
    //   <td  class="">
    //     <app-status-text  _nghost-c13="">Open</app-status-text>
    //   </td>
    //   <td  class="">
    //     <app-ether >
    //       <app-currency symbol="ETH" _nghost-c16="">
    //         <span _ngcontent-c16="" class="currency">
    //           <span _ngcontent-c16="" class="amount"> 0 </span>
    //           <sup _ngcontent-c16="" class="denomination">ETH</sup>
    //         </span>
    //       </app-currency>
    //     </app-ether>
    //   </td>
    //   <td  class=""> </td>
    //   <td  class="">
    //     <app-styled-button  >
    //       <a  href="/p/StwoiGTd1Mg/contributor?wallet=0x443c7cd6e81dbe8a208203c716c00d4f359b10cc">
    //         <button   class="mat-button">
    //           <span > Withdraw Ether </span>
    //           <div class="mat-button-ripple mat-ripple" matripple=""></div>
    //           <div ></div>
    //         </button>
    //       </a>
    //     </app-styled-button>
    //   </td>
    // </tr>
  //)}

// connecting your component to the redux manager   
// const mapStateToProps = (state) => ({
//   users: state.userState.users,
// });

// connectiong to the reducer manager and specify the action going with it
// const mapDispatchToProps = (dispatch) => ({
//   onSetUsers: (users) => dispatch({ type: 'USERS_SET', users }),
// });
//#endregion

                        


const mapStateToProps = (state) => ({
  address: state.getIn(['addressState', 'items']), //state.addressState.items,
  loading: state.getIn(['addressState', 'loading']), //state.addressState.loading,
  error: state.getIn(['addressState', 'error']), //state.addressState.error,  

  // address: state.addressState.items,
  // loading: state.addressState.loading,
  // error: state.addressState.error
});
const authCondition = (authUser) => !!authUser; // make sure the user is authentified


const MyPoolsPageWithAuthorization = compose(
                                            WithAuthorization(authCondition),
                                            connect(mapStateToProps)
                                          ) (MyPoolsPage);

export { MyPoolsPageWithAuthorization as PoolsPage }; 