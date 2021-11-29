// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

/// @title Revenue Token
/// @author Kevin Smith <kevin.smith@coinbase.com>
/// @notice RevenueToken lets groups of individuals manage shares of equity in
///           incoming funds, both ether and ERC-20 tokens. The contract behaves
///           like a standard ERC-20 token, with some extra functionality. When
///           funds are sent to this contract, they can be distributed
///           proportionally to holders of the token. Members can forfeit their
///           share or send it to other participants. To save on gas, a single
///           instance of this contract is deployed and minimal proxy clones may
///           be created by calling `clone`. This cloned contract may be used
///           identically to the parent, but is much cheaper to create.
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
  mapping (address => bool) private _participant;
  address[] private _participants;

  // Events
  event Clone(address indexed sender, address cloneAddress);
  event AddParticipant(address participant, address sender, uint256 amount);
  event Forfeit(address forfeiter);
  event DistributeEth();
  event DistributeToken(address tokenAddress);

  /// @dev This should only be called when deploying the parent contract. All
  ///        clones receive their initial parameters via `setCloneParameters`
  /// @param name_ The descriptive name for the token
  /// @param symbol_ The short symbol for the token
  /// @param initialAccount The address that should receive the initial supply
  constructor(
    string memory name_,
    string memory symbol_,
    address initialAccount
  ) ERC20(name_, symbol_) {
    _name = name_;
    _symbol = symbol_;
    _participant[initialAccount] = true;
    _participants.push(initialAccount);
    _mint(initialAccount, totalSupply());
  }

  /// @dev This enables the contract to receive ether
  receive() external payable {}

  /// @notice This should be called to create a minimal proxy clone, usable as
  ///           its own Revenue Token but with a much lower creation cost
  /// @param name_ The descriptive name for the token
  /// @param symbol_ The short symbol for the token
  /// @param initialAccount The address that should receive the initial supply
  /// @return The address of the clone that was created
  function clone(
    string memory name_,
    string memory symbol_,
    address initialAccount
  ) public returns (address) {
    address cloneAddr = address(this).clone();
    RevenueToken(payable(cloneAddr))
      .setCloneParameters(name_, symbol_, initialAccount);
    emit Clone(_msgSender(), cloneAddr);
    return cloneAddr;
  }

  /// @notice Used internally to set the initial parameters for a clone
  /// @dev While technically public, the `onlyParent` modifier ensures that this
  ///        method can only be called on a clone by its parent contract
  /// @param name_ The descriptive name for the token
  /// @param symbol_ The short symbol for the token
  /// @param initialAccount The address that should receive the initial supply
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

  /// @notice Returns the descriptive name for the token
  /// @dev Duplicated here because otherwise calls to clones go to the
  ///        ERC20 contract that the parent inherits from, which does not know
  ///        about the clone's storage slots
  function name() public view virtual override returns (string memory) {
    return _name;
  }

  /// @notice Returns the symbol for the token
  /// @dev Duplicated here because otherwise calls to clones go to the
  ///        ERC20 contract that the parent inherits from, which does not know
  ///        about the clone's storage slots
  function symbol() public view virtual override returns (string memory) {
    return _symbol;
  }

  /// @notice Each unit represents a 1% share, so the max is 100 (with 18 decimals)
  /// @return The total supply of the token
  function totalSupply() public pure override returns (uint256) {
    return 100000000000000000000;
  }

  /// @dev Overridden here to add modifiers
  /// @param recipient The address to transfer to
  /// @param amount The amount to transfer
  function transfer(
    address recipient,
    uint256 amount
  ) public override onlyIfParticipant(recipient) returns (bool) {
    return super.transfer(recipient, amount);
  }

  /// @dev Overridden here to add modifiers
  /// @param sender The address to transfer from
  /// @param recipient The address to transfer to
  /// @param amount The amount to transfer
  function transferFrom(
    address sender,
    address recipient,
    uint256 amount
  ) public virtual override onlyIfParticipant(sender) onlyIfParticipant(recipient) returns (bool) {
    return super.transferFrom(sender, recipient, amount);
  }

  /// @notice Adds an address as a participant in the revenue token
  /// @param newParticipant The address to add as a participant
  /// @param amount The initial share to transfer to the participant
  /// @return Whether the participant was added in this contract call (false if
  ///           the participant was already present)
  function addParticipant(
    address newParticipant,
    uint256 amount
  ) public onlyParticipants returns (bool) {
    if (!isParticipant(newParticipant)) {
      _participant[newParticipant] = true;
      _participants.push(newParticipant);
      bool transferResult = transfer(newParticipant, amount);
      emit AddParticipant(newParticipant, _msgSender(), amount);
      return transferResult;
    }
    return false;
  }

  /// @notice Removes the sender from the participants, transferring their
  ///           tokens proportionally to other participants
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
    emit Forfeit(_msgSender());
  }

  /// @notice Distributes ether held in the contract proportionally to all
  ///           participants based on their token holdings
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
    emit DistributeEth();
  }

  /// @notice Distributes an ERC-20 token held in the contract proportionally to
  ///           all participants based on their token holdings
  /// @param _token The address of the ERC-20 token to distribute
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
    emit DistributeToken(_token);
  }

  /// @param participant_ The address to check for participation
  /// @return Whether the address is a participant
  function isParticipant(address participant_) public view returns (bool) {
    return _participant[participant_];
  }

  /// @return The list of participants
  function participants() external view returns (address[] memory) {
    return _participants;
  }

  /// @dev Requires the sender to be a participant
  modifier onlyParticipants() {
    require(_participant[_msgSender()], 'Caller is not a participant');
    _;
  }

  /// @dev Requires `addr` to be a participant
  /// @param addr The address to require as a participant
  modifier onlyIfParticipant(address addr) {
    require(_participant[addr], 'Argument is not a participant');
    _;
  }

  /// @dev Requires the caller to be the parent contract, and by necessity
  ///        requires the receiver to be a minimal proxy clone
  modifier onlyParent() {
    require(_msgSender() == parentAddress(), 'May only be called from cloning contract');
    _;
  }

  /// @dev Reads the clone's own bytecode (which contains the address of the parent
  ///        contract) and returns the parent contract's address
  /// @return parent The address of the parent contract that created the clone
  function parentAddress() private view returns (address parent) {
    bytes memory addressBytes = new bytes(20);
    assembly {
      extcodecopy(address(), addressBytes, 10, 20)
      parent := mload(sub(addressBytes, 12))
    }
  }
}
