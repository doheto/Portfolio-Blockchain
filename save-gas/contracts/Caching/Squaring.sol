// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Squaring {

    uint[] public nums;
    uint[] public sqrs;
    constructor (uint[] memory _nums) {
        nums = _nums;
        sqrs = new uint[](nums.length);
    }

    function sqrNumUncached(uint _index) external {
        uint sqr;
        for(uint i = 0; i <= nums[_index]; i++) {
            sqr += nums[_index];
        }
        sqrs[_index] = sqr;
    }
    function sqrNumCached(uint _index) external {
        uint sqr;
        uint num = nums[_index];
        for(uint i = 1; i <= num; i++){
            sqr += num;
        }
        sqrs[_index] = sqr;
    }
}
