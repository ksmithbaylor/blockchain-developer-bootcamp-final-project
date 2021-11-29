// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract FakeToken is ERC20 {
  constructor(
    address initialAccount,
    uint256 initialBalance
  ) ERC20("FakeToken", "FAKE") {
    _mint(initialAccount, initialBalance);
  }

  function mint(address account, uint256 amount) public {
    _mint(account, amount);
  }

  function decimals() public pure override returns (uint8) {
    return 6;
  }
}
