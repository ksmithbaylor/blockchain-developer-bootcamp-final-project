# Revenue Token

This dapp is my final project for the 2021 ConsenSys Blockchain Developer
Bootcamp. It [is deployed here](https://revenue-token.netlify.app/), and
a screencast of me going through the code and interface
[may be found here](https://www.youtube.com/watch?v=St0jLqT4kLo).

The main contract is [deployed on Ropsten](https://ropsten.etherscan.io/address/0xabc044cfc1730768b8b8b1ce83b4d97efc5b0942),
though it is mainly interacted with by users deploying minimal proxy clones that
delegate to this parent contract.

Once the course is over, I'd like my certification NFT to be sent to
[ksmith.eth (0xa5D3Bc5ac4a5850D1673814489B3BCe8C584Bf48)](https://etherscan.io/address/0xa5d3bc5ac4a5850d1673814489b3bce8c584bf48).

## Overview

Revenue Token is a utility contract that can be used to automatically split up
incoming revenue received amongst any number of parties according to their
equity percentage. The equity percentage of each party is determined by the
amount held of the total supply of a unique ERC20-like token compared to its
fixed total supply.

In this way, co-founders, collaborators, and team members who have an
initially-trusting relationship can set up the equity allocation and even change
it over time, and incoming funds will be accessible in the right amounts to the
right people based on the distribution when the funds were received, even if a
party no longer holds equity.

Any participant can distribute funds proportionally to everyone at and point.
If a participant is transferring some of their shares to someone else or adding
a new participant, it is beneficial to distribute the funds beforehand in order
to receive a larger share. In effect, this guarantees that funds are distributed
based on the holdings when they were received (assuming the incentive holds).

## Example use-case

Imagine a team working on an income-generating project who decide to split up
the anticipated revenue. The team consists of our good friends Alice, Bob, and
Carol. They decide that Alice should get 50% of the income, Bob 30%, and Carol
20%.

The team deploys a Revenue Token contract with this information, and direct all
revenue collection to this contract. For every payment that comes in, each team
member can rest assured knowing that they will receive their portion. Any of
them can immediatly distribute the funds, or wait for them to build up and
distribute less frequently if desired.

Later on, Bob decides to leave the team and Carol has been contributing in his
place. Carol and Alice decide that Carol should get Bob's 30%, so it is now an
even split between Alice and Carol. Bob transfers his tokens to Carol, and new
payments are split between the two remaining members.

Alternately, Bob could have forfeited his entire position instead of
transferring to just one person. This would distribute his tokens proportionally
amongst the remaining participants, based on their existing relative holdings.

## Running

First, install dependencies:

    $ yarn
    $ cd frontend && yarn

Next, create a `.env` file that follows the format of the `.env.example` file.

To run the smart contract tests:

    $ yarn test

To deploy the smart contract to Ropsten:

    $ yarn deploy

To deploy the fake ERC-20 tokens to Ropsten:

    $ yarn hardhat --network ropsten run scripts/deploy-token.ts

To verify the deployed contract on Etherscan:

    $ yarn hardhat --network ropsten verify <contract_address> 'Revenue Token Parent' 'REV' <initial_account>

To run the frontend:

    $ cd frontend
    $ yarn dev

Then visit [http://localhost:3000](http://localhost:3000) in a browser with
Metamask installed.
