// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./PriceConverter.sol";

error NotOwner();

contract FundMe {
    using PriceConverter for uint256;

    uint256 public constant MINIMUM_USD = 50 * 1e18;

    address public immutable i_owner;
    address[] public funders;
    mapping (address => uint256) public addressToAmountFunded;

    constructor() {
        i_owner = msg.sender;
    }

    function fund() public payable {
        // Contract addresses can hold funds just like wallets

        // Revert w/ message "Didn't send enough!"
        // revert: undo any previous actions and send remaining gas back
        require(msg.value.getConversionRate() > MINIMUM_USD, "Didn't send enough!"); // 1e18 = 1 * 10^18 = 1000000000000000000 wei (1 eth)

        funders.push(msg.sender);
        addressToAmountFunded[msg.sender] = msg.value;
    }

    function withdraw() public onlyOwner {
        for (uint256 funderIndex = 0; funderIndex < funders.length; funderIndex++) {
            address funder = funders[funderIndex];

            addressToAmountFunded[funder] = 0;
        }

        // Reset funders array
        funders = new address[](0);

        // Withdraw the funds
        // transfer
        // payable(msg.sender).transfer(address(this).balance); // typecase msg.sender to payable address

        // send
        // bool sendSuccess = payable(msg.sender).send(address(this).balance);
        // require(sendSuccess, "Send failed!");

        // call
        (bool callSuccess,) = payable(msg.sender).call{value: address(this).balance}("");
        require(callSuccess, "Call failed!");
    }

    modifier onlyOwner {
        // require(msg.sender == i_owner, "Sender is not owner!");
        if (msg.sender != i_owner) { revert NotOwner(); }
        _;
    }

    // What happens if someone sends ETH but not through the fund fn?
    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }
}

// Transaction fields:

// Nonce: tx count for the account
// Gas Price: price per unit of gas (in wei)
// Gas Limit: max gas this tx can use
// To: address tx sent to
// Value: amount of wei to send
// Data: data sent
// v, r, s: components of tx signature
