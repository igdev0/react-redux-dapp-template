// SPDX-License-Identifier: MIT
pragma solidity >=0.8.30;

contract YourContract {
    uint public count;

    function sayHello() public pure returns (string memory) {
        return "Hello world";
    }

    function increment() public returns (uint) {
        count++;
        return count;
    }

    function decrement() public returns (uint){
        require(count > 0, "Cannot decrement because i must be bigger than 0");
        count--;
        return count;
    }
}
