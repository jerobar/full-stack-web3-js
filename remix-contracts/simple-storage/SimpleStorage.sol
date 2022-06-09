// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

contract SimpleStorage {
    uint favoriteNumber; // = 0; internal by default - storage variable

    mapping(string => uint256) public nameToFavoriteNumber;

    struct People {
        uint256 favoriteNumber;
        string name;
    }

    People[] public people; // dynamic array (any size)

    function store(uint256 _favoriteNumber) public virtual { // virtual = function can be overridden
        favoriteNumber = _favoriteNumber;
    }

    function retrieve() public view returns(uint256) {
        return favoriteNumber;
    }

    function add() public pure returns(uint256) {
        return (1 + 1);
    }

    // calldata (can't be modifed), memory (can be modified) mean vars only exist temporarily
    // storage variables exist even outside the function execution
    // data location must be declared for arrays, structs, and mappings
    function addPerson(string calldata _name, uint256 _favoriteNumber) public {
        people.push(People(_favoriteNumber, _name));
        nameToFavoriteNumber[_name] = _favoriteNumber;
    }
}

// Contract address: 0xd9145CCE52D386f254917e481eB44e9943F39138

// view, pure functions don't cost gas to run (view are read only, pure can't be read)
// unless being called INSIDE a function that costs gas

// EVM can access and store memory in:
// stack
// memory
// storage
// Calldata
// Code
// Logs
