# Design Pattern Decisions

- **Inter-Contract Execution**: I use standard ERC-20 transfer functions to
    distribute those funds to holders, and also make a call from the parent
    contract to its minimal proxy clones just after creation.
- **Inheritance and Interfaces**: My contract inherits from OpenZeppelin's
    ERC-20 token implementation.
- **Access Control Design Patterns**: My contract restricts many of its methods
    to callers who have explicitly been added to an allowlist of participants.
    It also enforces that a method call happens only from the parent contract to
    its proxy clones by introspecting the clone's bytecode and comparing the
    embedded implementation address to the caller to see if it is the parent.
