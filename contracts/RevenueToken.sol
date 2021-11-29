// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
// import "hardhat/console.sol";

contract RevenueToken is ERC20 {
  using SafeERC20 for IERC20;

  // ERC20 slots
  mapping(address => uint256) private _balances;
  mapping(address => mapping(address => uint256)) private _allowances;
  uint256 private _totalSupply;
  string private _name;
  string private _symbol;

  // REV-specific slots
  mapping (address => bool) public participant;
  address[] public _participants;

  constructor(
    string memory name,
    string memory symbol,
    address initialAccount
  ) ERC20(name, symbol) {
    participant[initialAccount] = true;
    _participants.push(initialAccount);
    _mint(initialAccount, totalSupply());
  }

  receive() external payable {}

  /// @notice each unit represents a 1% share, so the max is 100
  function totalSupply() public pure override returns (uint256) {
    return 100000000000000000000;
  }

  function transfer(address recipient, uint256 amount) public override onlyIfParticipant(recipient) returns (bool) {
    _transfer(_msgSender(), recipient, amount);
    return true;
  }

  function transferFrom(address sender, address recipient, uint256 amount) public virtual override onlyIfParticipant(sender) onlyIfParticipant(recipient) returns (bool) {
    _transfer(sender, recipient, amount);

    uint256 currentAllowance = _allowances[sender][_msgSender()];
    require(currentAllowance >= amount, "ERC20: transfer amount exceeds allowance");
    unchecked {
      _approve(sender, _msgSender(), currentAllowance - amount);
    }

    return true;
  }

  function addParticipant(address newParticipant, uint256 amount) public onlyParticipants returns (bool) {
    if (!isParticipant(newParticipant)) {
      participant[newParticipant] = true;
      _participants.push(newParticipant);
      return transfer(newParticipant, amount);
    }
    return false;
  }

  /// @notice Removes _msgSender() from the participants, transferring their tokens proportionally to other participants
  function forfeit() public onlyParticipants {
    require(_participants.length > 1, 'Cannot forfeit as the only participant');

    uint256 supply = totalSupply();
    uint256 balance = balanceOf(_msgSender());
    uint256 remaining = supply - balance;
    uint256 selfIndex;

    for (uint256 i = 0; i < _participants.length; i++) {
      address beneficiary = _participants[i];
      if (beneficiary == _msgSender()) {
        selfIndex = i;
        continue;
      }

      uint256 bal = balanceOf(beneficiary);
      uint256 portion = (supply * bal / remaining) - bal;
      transfer(beneficiary, portion);
    }

    _participants[selfIndex] = _participants[_participants.length - 1];
    _participants.pop();
    participant[_msgSender()] = false;
  }

  /// @notice Distributes ETH held in the contract to all participants
  function distributeEth() public onlyParticipants {
    uint256 supply = totalSupply();
    uint256 balance = address(this).balance;
    uint256 forCaller = balance;

    for (uint256 i = 0; i < _participants.length; i++) {
      address beneficiary = _participants[i];
      if (beneficiary == _msgSender()) {
        continue;
      }

      uint256 bal = balanceOf(beneficiary);
      uint256 portion = (balance * bal / supply);
      forCaller -= portion;
      payable(beneficiary).transfer(portion);
    }

    // Any integer rounding error goes to the caller
    payable(_msgSender()).transfer(forCaller);
  }

  /// @notice Distributes the token amount held by the contract to all participants
  function distributeToken(address _token) public onlyParticipants {
    IERC20 token = IERC20(_token);
    uint256 supply = totalSupply();
    uint256 balance = token.balanceOf(address(this));
    uint256 forCaller = balance;

    for (uint256 i = 0; i < _participants.length; i++) {
      address beneficiary = _participants[i];
      if (beneficiary == _msgSender()) {
        continue;
      }

      uint256 bal = balanceOf(beneficiary);
      uint256 portion = (balance * bal / supply);
      forCaller -= portion;
      token.safeTransfer(beneficiary, portion);
    }

    // Any integer rounding error goes to the caller
    token.safeTransfer(_msgSender(), forCaller);
  }

  function isParticipant(address _participant) public view returns (bool) {
    return participant[_participant];
  }

  function participants() external view returns (address[] memory) {
    return _participants;
  }

  modifier onlyParticipants() {
    require(participant[_msgSender()], 'Caller is not a participant');
    _;
  }

  modifier onlyIfParticipant(address addr) {
    require(participant[addr], 'Argument is not a participant');
    _;
  }

}
