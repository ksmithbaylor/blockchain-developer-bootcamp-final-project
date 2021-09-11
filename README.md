# ArtCrowd

ArtCrowd is a contest/bidding platform where artists submit their creations and
users bid on their favorites. Winning bidders keep the creations as NFTs, and
artists are awarded with the full winning bid amount as well as a share of the
bidding fees for each contest they enter. The winning artist receives a full 50%
of the fee pool, as well as the contest itself as an NFT. All bids are
incentivized with a governance token that is used to vote on platform changes
and also break bidding ties.

This dapp is my final project for the 2021 ConsenSys Blockchain Developer
Bootcamp.

## Details

- A contest is created with a theme/category, implemented as an NFT
- A creator creates something and submits it to the contest by minting an NFT
  that represents their creation
- People vote/bid on their favorite entry (or multiple entries) by sending some
  amount of ETH along with their vote
  - A portion (1-5%) of each vote/bid goes to a fee pool for the contest
- At the end of the contest:
  - All bidders:
    - Are awarded credits (as an ERC-20 token) proportional to their bids that
      are used to break ties and potentially for governance in the future
  - For every entry:
    - A winner is chosen by the following rules:
      - The person with the highest bid amount wins
      - In the event of a tie, the person with the highest credit balance wins
      - In the event of a tie in both bid amount and credit balance, the person
        with the highest Ethereum address wins (which is predictably random)
    - The winner:
      - Receives the NFT for that entry
    - Everyone else:
      - Receives their ETH back (except the fee portion)
      - Receives contest credits proportional to their bid as specified above
    - The creator:
      - Receives the full amount of the winning bid plus a portion of 40% of the
        contest's fee pool proportional to their bid share relative to the total
        contest bids
  - The creator of the winning entry:
    - Receives 50% of the contest's fee pool as a prize, plus the normal
      proportion like the other creators
    - Receives the contest itself as an NFT
  - The developers of the dapp:
    - Receive 10% of the fee pool, paid to a DAO to fund development
