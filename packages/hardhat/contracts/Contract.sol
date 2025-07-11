// SPDX-License-Identifier: MIT
pragma solidity >=0.8.30;

contract Contract {
    uint public i;

    function sayHello() public pure returns (string memory) {
        return "Hello world";
    }

    function increment() public returns (uint) {
        i++;
        return i;
    }

    function decrement() public returns (uint){
        require(i > 0, "Cannot decrement because i must be bigger than 0");
        i--;
        return i;
    }
}
