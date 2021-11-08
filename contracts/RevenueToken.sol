// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract RevenueToken is ERC20 {
  constructor(
    address initialAccount,
    uint256 initialBalance
  ) ERC20("RevenueToken", "REV") {
    _mint(initialAccount, initialBalance);
  }
}
