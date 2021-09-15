# Revenue Token

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

This dapp is my final project for the 2021 ConsenSys Blockchain Developer
Bootcamp.

## Example

Imagine a team working on an income-generating project who decide to split up
the anticipated revenue. The team consists of our good friends Alice, Bob, and
Carol.  They decide that Alice should get 50% of the income, Bob 30%, and Carol
20%.

The team deploys a Revenue Token contract with this information, and direct all
revenue collection to this contract. For every payment that comes in, each team
member has their share either forwarded directly to them or set aside to claim
later, depending on their preference.

Later on, Bob decides to leave the team and Carol has been contributing in his
place. Carol and Alice decide that Carol should get Bob's 30%, so it is now an
even split between Alice and Carol. Bob transfers his tokens to Carol, and new
payments are split between the two remaining members. Bob can still claim any
unclaimed balance that he is owed at any point, but will not receive new revenue
unless Alice or Carol transfer tokens to him.
