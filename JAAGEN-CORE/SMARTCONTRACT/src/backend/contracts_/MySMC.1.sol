pragma solidity ^0.4.24;

//import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./SafeMath.sol";
import "./ERC20Token.sol"; // by implementing this we compatible with ERC20/223/777
/**
 * A Contract for the pool
 * TODO : TRANSFEROWNERSHIP, RENOUNCEOWNERSHIP, SAFEMATH, PAUSABLE
 **/
contract  MySMC {
// #region VARS

    using SafeMath for uint256;
    ERC20Token private ERC20Interface;

    address[4] public managersAddress;  // the managers of the pool
    uint public TotalPoolValue;           // the size of the pool you can not exceed 
    uint public TotalCurrentValue;        // the actual value of the pool. it is not the value inside the contract 
                                          // cause there might be people who contributed who are not whitelisted
    uint[4] fees;                         // ManagerFee; serviceFeePercentage, NumberOfAutodistrib; FeePerAutodistrib;
    uint internal MinAmountPerContributor; // obvious
    uint internal MaxAmountPerContributor; // obvious 
    address internal DestinationAddress;   // the address receiving the eth
    bytes internal DataField;              // data to include in case of smart contract
    uint8 internal state;                  // 0-notcreated, 1-open, 2-cancel, 3-paid, 4-tokensreceived, 5-refund
    address internal RefundAddress;        // where the refund eth is coming from
    address internal TokenContractAddress; // the contract address where the tokens have been generated from
    //bytes32 internal TokenContractsymbol;  // Symbol of the contract address where the tokens have been generated from
    uint internal EthReceivedForRefund;    // the amount of eth received for refund
    uint internal TokensAmountReceived;    // the amount of tokens received
    
    struct ContributorStruct {             // 
        uint value;
        uint arrayIndex;
        uint valueRefundWithdrawn; 
        uint valueTokenWithdrawn;
    }
    mapping(address => ContributorStruct) public Contributors;    // map of everyone  whitelisted or contributing
    address[] private ContributorsArray;    // address of contributors to track the map, since map dont have a key list
    bool private WhitelistCreated;          // need to know if the whitelist has been created 
    string private passWl;                  // message signing 
    
    
    address private constant serviceAddress = 0x4FC046ba137c6b75e98b56cbb33CA58869CC5161; // this is our bank accpuont to be paid lol
    event NewDeposit(address indexed sender, uint indexed amount); //1: add to, 2 blnk new
    event LogNewWithdraw   (address indexed withdrawer, uint indexed amountWihdrawn);
    event LogNewTokenWithdraw   (address indexed withdrawer, uint indexed tokenAmountWihdrawn);
    event LogNewRefundWithdraw   (address indexed withdrawer, uint indexed amountWihdrawn);
    event WhitelistState   (bool indexed statew, string s);
    event setValueInPool(uint TotalPoolValueIn, uint MinAmountPerContributorIn, uint MaxAmountPerContributorIn);
    event stateChanged(uint8 indexed state, address indexed refundAddressOrTokensContract, uint indexed TokensAmountReceived);
    event PaymentDone(address giverOfOrder, uint indexed amountToSendToDestinationAddress, uint indexed amountToSendToTheManager, address indexed payToAddress);
    event RefundReceived(uint indexed refundamountreceived, uint indexed EthReceivedForRefund);
    event ecrecov(address indexed adr);
    modifier  OwnerOnly {
        require(isOwner(msg.sender), "sender is not owner");
        _;
    }
// #endregion


// #region CONSTRUCTOR
    // uint8 managerFee, uint serviceFees, uint sendingFee, uint8 numberOfAutodistrib, uint feePerAutodistrib, 
    // Create Smart Contract for the Pool
    constructor(address[4] managers,uint totalPoolValue, uint[4] allfees, uint minAmountPerContributor, 
                uint maxAmountPerContributor, address destinationAddress, bytes dataField, bool isWhitelist) public {
        require(allfees.length==4, "we need an array of 4 fees in entry");
        state = 1;
        managersAddress = managers;
        TotalPoolValue = totalPoolValue;
        fees = allfees;
        MinAmountPerContributor = minAmountPerContributor; 
        MaxAmountPerContributor = maxAmountPerContributor; 
        DestinationAddress = destinationAddress;
        DataField = dataField;
        WhitelistCreated = isWhitelist;
        EthReceivedForRefund = 0;
        TokensAmountReceived = 0;
    }

    // checks if caller is the owner
    function  isOwner(address addr) internal view returns(bool) {
        bool result = false;
        uint arlength = managersAddress.length;
        if ((arlength>=1)&&(addr == managersAddress[0])) {
            result = true;
        } else if ((arlength>=2)&&(managersAddress[1]!=address(0))&&(addr==managersAddress[1])){
            result = true;
        } else if ((arlength>=3)&&(managersAddress[2]!=address(0))&&(addr==managersAddress[2])){
            result = true;
        } else if ((arlength>=4)&&(managersAddress[3]!=address(0))&&(addr==managersAddress[3])){
            result = true;
        }
        return result;
    }

    function isContract(address account) internal view returns (bool) {
        uint256 size;
        // XXX Currently there is no better way to check if there is a contract in an address
        // than to check the size of the code at that address.
        // See https://ethereum.stackexchange.com/a/14016/36603
        // for more details about how this works.
        // TODO Check this again before the Serenity release, because all addresses will be
        // contracts then.
        // solium-disable-next-line security/no-inline-assembly
        assembly { size := extcodesize(account) }
        return size > 0;
    }
// #endregion

// #region GETTERS SETTERS

    // retrieve all the parameters that should be displayed to the user
    function get() public view OwnerOnly returns(uint[4] feesp,
                                    uint MinAmountPerContributorp,
                                    uint MaxAmountPerContributorp,
                                    address[] ContributorArrayp,
                                    address DestinationAddressp,
                                    bytes DataFieldp,
                                    uint statep){
        MinAmountPerContributorp = MinAmountPerContributor;
        MaxAmountPerContributorp = MaxAmountPerContributor;
        DestinationAddressp = DestinationAddress;
        DataFieldp = DataField;
        statep = state;
        feesp = fees;
        ContributorArrayp = ContributorsArray;
    }
    // set vars that can be changed in the smart contract
    function set(uint TotalPoolValueIn, uint MinAmountPerContributorIn, uint MaxAmountPerContributorIn) public OwnerOnly {
        // require(isOwner(msg.sender), "sender must be owner");
        require(state==1, "pool must be open");
        TotalPoolValue = TotalPoolValueIn;
        MinAmountPerContributor = MinAmountPerContributorIn;
        MaxAmountPerContributor = MaxAmountPerContributorIn;
        emit setValueInPool(TotalPoolValue, MinAmountPerContributor, MaxAmountPerContributor);
    }

// #endregion



// #region DEPOSIT WITHDRAW PAYTO

    // deposit eth into the contract
    function deposit() public payable{
        require(!WhitelistCreated, "Wrong Action");
        require(state==1, "deposit state==1");
        require(msg.value >= MinAmountPerContributor, "deposit msg.value >= MinAmountPerContributor");
        require(msg.value <= MaxAmountPerContributor, "deposit msg.value <= MaxAmountPerContributor");
        require(msg.value <= TotalPoolValue.sub(TotalCurrentValue), "no more space for deposit"); // check that we dont reach the max for the pool 
        //save in contributors
        subdeposit();
    }

    // deposit eth into the contract
    // function alloweddeposit(uint8 _v, bytes32 _r, bytes32 _s) onlyValidAccess(_v,_r,_s) public payable {
    function alloweddeposit(bytes sig) onlyValidAccess(sig) public payable {
        require(WhitelistCreated, "Unauthorized Action");
        require(state==1, "deposit state==1");
        require(msg.value >= MinAmountPerContributor, "deposit msg.value >= MinAmountPerContributor");
        require(msg.value <= MaxAmountPerContributor, "deposit msg.value <= MaxAmountPerContributor");
        require(msg.value <= TotalPoolValue.sub(TotalCurrentValue), "no more space for deposit"); // check that we dont reach the max for the pool 
        //save in contributors
        subdeposit();
    }


    function subdeposit() private {
        //save in contributors
        TotalCurrentValue = TotalCurrentValue.add(msg.value);
        if (Contributors[msg.sender].value>0) {
            Contributors[msg.sender].value = msg.value.add(Contributors[msg.sender].value);    
            emit NewDeposit(msg.sender, msg.value); // dont forget to add to history
        } else {
            Contributors[msg.sender].value = msg.value;
            ContributorsArray.push(msg.sender); 
            emit NewDeposit(msg.sender, msg.value);
        }
    }

    // withdraw
    function withdraw(uint amount) public{
        if (state == 5) {
            require((EthReceivedForRefund > 0 ether) && (Contributors[msg.sender].value>0), "Refund not received and the user must have contributed before");
            uint maxwithdraw = (Contributors[msg.sender].value.mul(EthReceivedForRefund)).div(TotalCurrentValue);
            require((maxwithdraw>=amount.add(Contributors[msg.sender].valueRefundWithdrawn) ), "the amount you desire to withdraw plus the ones you withdrawn already in refund mode must be equal or less to allocated amount");
            // setting valueWithdrawn  
            Contributors[msg.sender].valueRefundWithdrawn = amount.add(Contributors[msg.sender].valueRefundWithdrawn);
            msg.sender.transfer(amount);
            emit LogNewRefundWithdraw(msg.sender, amount);
        } else if (state == 4) {  // tokens withdraw in tokens recieved mode
            require((TokensAmountReceived > 0) && (Contributors[msg.sender].value>0), "tokens not received yet or you never contributed before");  // make sure we have funds 
            uint maxtokenwithdraw = (Contributors[msg.sender].value.mul(TokensAmountReceived)).div(TotalCurrentValue);
            require(maxtokenwithdraw >= amount.add(Contributors[msg.sender].valueTokenWithdrawn), "Insufficient balance");  // make sure we have funds
            // setting valueTokenWithdrawn  
            Contributors[msg.sender].valueTokenWithdrawn = amount.add(Contributors[msg.sender].valueTokenWithdrawn);
            ERC20Interface = ERC20Token(TokenContractAddress);
            require(ERC20Interface.transfer(msg.sender, amount), "Tokens Transfer failed");
            emit LogNewTokenWithdraw(msg.sender, amount); 
        }  
        else {
            // check if we have the right to withdraw
            // states open cancel or refund
            require((state==1 || state==2), "Pool State must be either open, cancel");

            require((Contributors[msg.sender].value>0), "the user must have contributed before");
            require((Contributors[msg.sender].value>=amount), "Amount to withdraw should be less or equal to amount in contract for this user");
            //set the value to 
            Contributors[msg.sender].value = (Contributors[msg.sender].value).sub(amount);
            if (state==1) { //it is only when pool is open that current value should change when we withdraw
                TotalCurrentValue = TotalCurrentValue.sub(amount);
            }
            msg.sender.transfer(amount);
            emit LogNewWithdraw(msg.sender, amount);
        }
        
    }
    
    // payToCOntract function,  how to estimate the gas to be used and not impact our own funds ? 
    function payTo(address payToAddress) public OwnerOnly {
        // require(isOwner(msg.sender), "Must be owner");
        require((state==1), "Pool State must be open");
        DestinationAddress = payToAddress;
        // amount to pay 
        // we have to withdraw 
        // serviceFee  +  managerFee  +  SendingFee  +   autodistributionfee
        // ManagerFee; serviceFeePercentage, NumberOfAutodistrib; FeePerAutodistrib;
        uint autoDistribution = fees[2].mul(fees[3].mul(ContributorsArray.length));
        uint amountToSendToTheService = (TotalCurrentValue.mul(fees[1])).div(1000);
        uint amountToSendToTheManager = (TotalCurrentValue.mul(fees[0])).div(100);
        // sending fee to the address :  SendingFee
        uint amountToSendToDestinationAddress = TotalCurrentValue.sub(autoDistribution).sub(amountToSendToTheService).sub(amountToSendToTheManager).sub(fees[3]);
        
        //_receiver.call.value(msg.value).gas(20317)();
        DestinationAddress.transfer(amountToSendToDestinationAddress);
        serviceAddress.transfer(amountToSendToTheService);
        managersAddress[0].transfer(amountToSendToTheManager);
        state = 3;
        emit PaymentDone(msg.sender, amountToSendToDestinationAddress, amountToSendToTheManager, payToAddress);
    }

    // default function used for refund 
    // require that u are in refund mode and also require that ur address is equal the one specified for refund purpose
    // for refund and token with draw u calculate percentage on the go and accordingly u send the requested amount of eth or tokens
    // 
    function () private payable {  
        require(state==5, "Pool State must be refund");  //Pool State must be either open, cancel or refund
        require(RefundAddress==msg.sender, "Sender must be the right refunder");
        require(msg.value > 0 ether, "you must send more than 0 ether ");
        EthReceivedForRefund = EthReceivedForRefund.add(msg.value);
        // now here what do we do ? 
        // send an event saying that an amount of refund has been received
        // the back will receive it and then this one will send it back to the front who will calculate the amount each one can 
        // withdraw. if u try to withdraw the smc will calculate it on the go and limit u. yh smart boy lol 
        emit RefundReceived(msg.value, EthReceivedForRefund);
    }
// #endregion END DEPOSIT WITHDRAW
    


   
// CHANGE STATE OF POOL
    //0-notcreated, 1-open, 2-cancel, 3-paid, 4-tokensreceived, 5-refund
    // set state of the pool 

    // from open u can go to either cancel or Paid
        // from cancel no other state possible
        // from paid u can go to either token receive or Refund
            // from token receive just receive token or autodistribute
            // from refund (you take all fee and gas change ) and autodistribute or withdraw
    function stater(uint8 stateIn, address refunderOrTokenReceivedContract) public OwnerOnly {
        require((state==1 || state==3), "Pool State must be either open or paid");
        require((stateIn>0 && stateIn<=5), "wrong state");
        // require(isOwner(msg.sender), "owner only");
        //open 
        if(state == 1) {
            require((stateIn==2 || stateIn==3), "open to cancel or paid");
            state = stateIn;
            emit stateChanged(state, address(0), 0);
        }
        // paid
        else if(state == 3) {
            require((stateIn==4 || stateIn==5), "paid to token receive or refund");
            state = stateIn; 
            if(state == 5) {
                // setting the address that will do the refund 
                // withdraw the fees and gas !!!!
                RefundAddress = refunderOrTokenReceivedContract;
                emit stateChanged(state, RefundAddress, 0);
            }
            // tokens received is treated in a separate function
            // else if(state == 4) {
            //     // enable token withdraw 
            //     // TokenContractAddress = ;
            // }   
        }
        else if(state == 5) {
            require(stateIn==5, "paid to token receive or refund");
            RefundAddress = refunderOrTokenReceivedContract;
            emit stateChanged(state, RefundAddress, 0);
        }
    }
    //0-notcreated, 1-open, 2-cancel, 3-paid, 4-tokensreceived, 5-refund
    
    // confirm tokens that are received
    function confirmTokens(address contractAddress) public OwnerOnly {
        // we need to be in the right state to confirm tokens
        require(state==3, "We are not in the right state to confirm token");
        require(contractAddress != 0x0, "token contract address can not be null");
        // verify that it is a contract 
        require(isContract(contractAddress), "This is not a valid SmartContract");
        ERC20Interface = ERC20Token(contractAddress);
        require(ERC20Interface.balanceOf(address(this))>0, "Tokens have not been received");
        state = 4;
        TokenContractAddress = contractAddress;
        TokensAmountReceived = ERC20Interface.balanceOf(address(this)); 
        emit stateChanged(state, TokenContractAddress, TokensAmountReceived);
    }
// #endregion


// #region WHITELIST
    function setw(bool statew, string si) public OwnerOnly {
        require(state==1, "pool must be open");
        WhitelistCreated = statew;
        passWl = si;
        emit WhitelistState(WhitelistCreated, passWl);
    }
    
    //modifier onlyValidAccess(uint8 _v, bytes32 _r, bytes32 _s) 
    //{
    //    require( isValidAccessMessage(msg.sender,_v,_r,_s), " Not owner it seems " );
    //    _;
    //}
    modifier onlyValidAccess(bytes sig) 
    {
        require( isValidAccessMessage(msg.sender,sig), " Not owner it seems " );
        _;
    }
 
    /* 
    * @dev Verifies if message was signed by owner to give access to _add for this contract.
    *      Assumes Geth signature prefix.
    * @param _add Address of agent with access
    * @param _v ECDSA signature parameter v.
    * @param _r ECDSA signature parameters r.
    * @param _s ECDSA signature parameters s.
    * @return Validity of access message for a given address.
    */
    //function isValidAccessMessage(address _add, uint8 _v, bytes32 _r, bytes32 _s) public returns (bool)
    //{
    //    bytes32 hash = keccak256(abi.encodePacked(this, _add));
    //    address w = ecrecover(keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hash)), _v, _r, _s);
    //    emit ecrecov(w);
    //    return true;//w == 0x6a8e44545803c5393af369c9B80150717a1C3710; //return isOwner (w);//passWl
    //}
    function isValidAccessMessage(address _add, bytes sig) public returns (bool)
    {
        // This recreates the message that was signed on the client.
        bytes32 message = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", keccak256(abi.encodePacked(this, _add)) ) );

        recoverSigner(message, sig);
        return true;//isOwner(recoverSigner(message, sig));
    }

    function splitSignature(bytes sig) internal pure returns (uint8, bytes32, bytes32)
    {
        require(sig.length == 65);
        bytes32 r;
        bytes32 s;
        uint8 v;

        assembly {
            // first 32 bytes, after the length prefix
            r := mload(add(sig, 32))
            // second 32 bytes
            s := mload(add(sig, 64))
            // final byte (first byte of the next 32 bytes)
            v := byte(0, mload(add(sig, 96)))
        }
        return (v, r, s);
    }

    function recoverSigner(bytes32 message, bytes sig) internal returns (address)
    {
        uint8 v;
        bytes32 r;
        bytes32 s;

        (v, r, s) = splitSignature(sig);
        emit ecrecov(ecrecover(message, v, r, s));
        return ecrecover(message, v, r, s);
    }
// #endregion
}