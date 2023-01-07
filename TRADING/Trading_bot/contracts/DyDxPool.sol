pragma solidity <=0.8.10;

import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

abstract contract DyDxPool is Structs {
    function getAccountWei(Info memory account, uint256 marketId)
        public
        view
        virtual
        returns (Wei memory);

    function operate(Info[] memory, ActionArgs[] memory) public virtual;
}