// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
// import "hardhat/console.sol";

contract RevenueToken is ERC20 {
  mapping (address => bool) public participant;
  address[] public _participants;

  constructor(
    address initialAccount
  ) ERC20("RevenueToken", "REV") {
    participant[initialAccount] = true;
    _participants.push(initialAccount);
    _mint(initialAccount, totalSupply());
  }

  /// @notice each unit represents a 1% share, so the max is 100
  function totalSupply() public pure override returns (uint256) {
    return 100000000000000000000;
  }

  function transfer(address recipient, uint256 amount) public override onlyIfParticipant(recipient) returns (bool) {
    _transfer(_msgSender(), recipient, amount);
    return true;
  }

  function approve(address spender, uint256 amount) public override onlyIfParticipant(spender) returns (bool) {
    _approve(_msgSender(), spender, amount);
    return true;
  }

  function addParticipant(address newParticipant, uint256 amount) public onlyParticipants returns (bool) {
    participant[newParticipant] = true;
    _participants.push(newParticipant);
    return transfer(newParticipant, amount);
  }

  /// @notice Removes msg.sender from the participants, transferring their tokens to other participants
  function forfeit() public onlyParticipants {
    require(_participants.length > 1, 'Cannot forfeit as the only participant');

    uint256 supply = totalSupply();
    uint256 balance = balanceOf(msg.sender);
    uint256 remaining = supply - balance;
    uint256 selfIndex;

    for (uint256 i = 0; i < _participants.length; i++) {
      // totalSupply * bBal / (totalSupply - aBal) - bBal
      address beneficiary = _participants[i];
      if (beneficiary == msg.sender) {
        selfIndex = i;
        continue;
      }

      uint256 bal = balanceOf(beneficiary);
      uint256 portion = (supply * bal / remaining) - bal;
      transfer(beneficiary, portion);
    }

    _participants[selfIndex] = _participants[_participants.length - 1];
    _participants.pop();
    participant[msg.sender] = false;
  }

  function distributeEth() public onlyParticipants {
    // Distributes ETH held in the contract to all participants
  }

  function distributeToken(address _token) public onlyParticipants {
    // Distributes the token amount held by the contract to all participants
  }

  function isParticipant(address _participant) external view returns (bool) {
    return participant[_participant];
  }

  function participants() external view returns (address[] memory) {
    return _participants;
  }

  modifier onlyParticipants() {
    require(participant[msg.sender], 'Caller is not a participant');
    _;
  }

  modifier onlyIfParticipant(address addr) {
    require(participant[addr], 'Argument is not a participant');
    _;
  }

}
