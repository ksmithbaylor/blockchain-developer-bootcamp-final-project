// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @title Fake Token
/// @author Kevin Smith <kevin.smith@coinbase.com>
/// @notice This is a simple ERC-20 token, to be used for testing
contract FakeToken is ERC20 {
  /// @param initialAccount The account that receives the initial supply
  /// @param initialBalance The initial total supply
  constructor(
    address initialAccount,
    uint256 initialBalance
  ) ERC20("FakeToken", "FAKE") {
    _mint(initialAccount, initialBalance);
  }

  // @return The decimals used to display balances of this token
  function decimals() public pure override returns (uint8) {
    return 6;
  }
}
