// SPDX-License-Identifier: MIT
pragma solidity >=0.8.30;

contract Counter {
    uint public count;
    event Incremented(address indexed addr, uint indexed _count);
    event Decremented(address indexed addr, uint indexed _count);

    function sayHello() public pure returns (string memory) {
        return "Hello world";
    }

    function increment() public returns (uint) {
        count++;
        emit Incremented(msg.sender, count);
        return count;
    }

    function decrement() public returns (uint){
        require(count > 0, "Cannot decrement because i must be bigger than 0");
        emit Decremented(msg.sender, count);
        count--;
        return count;
    }
}
