pragma solidity ^0.4.24;
import "./MySMC.sol";
//import "../node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./Ownable.sol";

// @TODO:
//MAYBE YOU NEED TO IMPLEMENT ISPAUSABLE AND ALSO 
//BEING ABLE TO TRANSFER YOUR PAYMENT ADDRSS DOWN TO THE CHILDREN
// TRANSFEROWNERSHIP, RENOUNCEOWNERSHIP, SAFEMATH, PAUSABLE
//CLEAN USELESS FUNCTION LIKE EQUAL

/**
 * it is the pool factory
 **/
contract MySMCFactory is Ownable{
    uint public feePerAutodistrib = 60 finney;   // cost for each sending to final recipient, also cost for each autodistribution
    uint public serviceFeePercentage = 5; // percentage taken by us for each pool created   (to divide by 1000)
    event NewUserMail(address adrs, bytes32 mail); // new event to log new user registration
    event ContractCreated(string the,       // the is the unique id
    address newAddress, address[4] managers,uint totalPoolValue, uint[4] allfees, uint minAmountPerContributor, 
    uint maxAmountPerContributor, address destinationAddress, bytes dataField, bool isWhitelist);// event emitted to keep track of the pool created
    event FactoryCreated(address newAddress);                                         // event emitted to keep track of the pool created
    event ServiceFeePercentageAndFeePerSending(uint feePercentage, uint feePerSending);// emit an event to say that we have a new 
                                                                                       //percentage for the fee, and a fee per sending or autodistribution
    // creating a new factory
    constructor() public{
        emit FactoryCreated(this);
    }
    // Creating a new pool smart contract
    function create(
        string the, bytes32 mail, address[4] managers, uint totalPoolValue, uint minAmountPerContributor,
        uint maxAmountPerContributor, bool isWhiteList, address destinationAddress, 
        bytes dataField, uint[4] allfees) // managerFee, uint numberOfAutodistrib) 
        public {
        
        require(managers[0]==msg.sender, "Sender must be the same as addres to verify");
        emit NewUserMail(managers[0],mail);

        // Create pool
        MySMC aPool = new MySMC(managers, totalPoolValue, allfees, minAmountPerContributor, 
        maxAmountPerContributor, destinationAddress, dataField, isWhiteList);
        emit ContractCreated(the, aPool, managers, totalPoolValue, allfees, minAmountPerContributor, maxAmountPerContributor, destinationAddress, dataField, isWhiteList);            
    }

    function setServiceFeePercentage(uint percentageTime100, uint feePerAutodistribution) public onlyOwner returns(bool) {
        serviceFeePercentage = percentageTime100;
        feePerAutodistrib = feePerAutodistribution;
        emit ServiceFeePercentageAndFeePerSending(serviceFeePercentage, feePerAutodistrib);
        return true;
    }

    function verifyUser(bytes32 mail, address adr) public{
        require(adr==msg.sender, "Sender must be the same as addres to verify");
        //require(equal(4), "");
        emit NewUserMail(adr,mail);
    }

    function equal(uint a) pure private returns (bool) {
        uint x = 0;
        for (uint i = 0; i < 32; i++) {
            uint b = uint(msg.data[35 - i]);
            x += b * 256**i;
        }
        return a == x;
    }
}
