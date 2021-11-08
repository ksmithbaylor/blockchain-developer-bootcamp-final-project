// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract RevenueToken is ERC20 {
  mapping (address => bool) public participant;

  modifier onlyParticipants() {
    require(participant[msg.sender]);
    _;
  }

  constructor(
    address initialAccount,
    uint256 initialBalance
  ) ERC20("RevenueToken", "REV") {
    participant[msg.sender] = true;
    _mint(initialAccount, initialBalance);
  }

  function addParticipant(address newParticipant, uint256 allocation) public onlyParticipants {
    // Adds a participant and transfers an allocation of revenue to them
  }

  function forfeit(address[] memory beneficiaries, uint256[] memory allocations) public onlyParticipants {
    // Removes msg.sender from the participants, transferring their tokens to
    // other participants
  }

  function distributeEth() public onlyParticipants {
    // Distributes ETH held in the contract to all participants
  }

  function distributeToken(address _token) public onlyParticipants {
    // Distributes the token amount held by the contract to all participants
  }

  function isParticipant(address _participant) public view returns (bool) {
    return participant[_participant];
  }
}
