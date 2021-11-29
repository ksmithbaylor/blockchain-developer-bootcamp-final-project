// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
// import "hardhat/console.sol";

contract RevenueToken is ERC20 {
  using SafeERC20 for IERC20;
  using Clones for address;

  // ERC20 slots
  mapping(address => uint256) private _balances;
  mapping(address => mapping(address => uint256)) private _allowances;
  uint256 private _totalSupply;
  string private _name;
  string private _symbol;

  // REV-specific slots
  mapping (address => bool) public _participant;
  address[] public _participants;

  // Events
  event Clone(address indexed sender, address cloneAddress);

  constructor(
    string memory name_,
    string memory symbol_,
    address initialAccount
  ) ERC20(name_, symbol_) {
    _participant[initialAccount] = true;
    _participants.push(initialAccount);
    _mint(initialAccount, totalSupply());
  }

  receive() external payable {}

  function clone(
    string memory name_,
    string memory symbol_,
    address initialAccount
  ) public returns (address) {
    address cloneAddr = address(this).clone();
    RevenueToken(payable(cloneAddr)).setCloneParameters(name_, symbol_, initialAccount);
    emit Clone(_msgSender(), cloneAddr);
    return cloneAddr;
  }

  function setCloneParameters(
    string memory name_,
    string memory symbol_,
    address initialAccount
  ) public onlyParent {
    _name = name_;
    _symbol = symbol_;
    _participant[initialAccount] = true;
    _participants.push(initialAccount);
    _mint(initialAccount, totalSupply());
  }

  function name() public view virtual override returns (string memory) {
    return _name;
  }

  function symbol() public view virtual override returns (string memory) {
    return _symbol;
  }

  /// @notice each unit represents a 1% share, so the max is 100 (with 18 decimals)
  function totalSupply() public pure override returns (uint256) {
    return 100000000000000000000;
  }

  /// @dev Overridden here to add modifiers
  function transfer(
    address recipient,
    uint256 amount
  ) public override onlyIfParticipant(recipient) returns (bool) {
    return super.transfer(recipient, amount);
  }

  /// @dev Overridden here to add modifiers
  function transferFrom(
    address sender,
    address recipient,
    uint256 amount
  ) public virtual override onlyIfParticipant(sender) onlyIfParticipant(recipient) returns (bool) {
    return super.transferFrom(sender, recipient, amount);
  }

  function addParticipant(address newParticipant, uint256 amount) public onlyParticipants returns (bool) {
    if (!isParticipant(newParticipant)) {
      _participant[newParticipant] = true;
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
    _participant[_msgSender()] = false;
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

  function isParticipant(address participant_) public view returns (bool) {
    return _participant[participant_];
  }

  function participants() external view returns (address[] memory) {
    return _participants;
  }

  modifier onlyParticipants() {
    require(_participant[_msgSender()], 'Caller is not a participant');
    _;
  }

  modifier onlyIfParticipant(address addr) {
    require(_participant[addr], 'Argument is not a participant');
    _;
  }

  modifier onlyParent() {
    require(_msgSender() == parentAddress(), 'May only be called from cloning contract');
    _;
  }

  /// @dev Reads the clone's own bytecode (which contains the address of the parent
  ///      contract) and returns the parent contract's address to help calculate
  ///      the create2 address the clone should be at
  /// @return parent The address of the parent PaymentHub contract that created the clone
  function parentAddress() private view returns (address parent) {
    bytes memory addressBytes = new bytes(20);
    assembly {
      extcodecopy(address(), addressBytes, 10, 20)
      parent := mload(sub(addressBytes, 12))
    }
  }
}
