# Avoiding Common Attacks

- **Use Modifiers Only for Validation**: I do not use modifiers other than to
    prefix methods with a `require` call.
- **Pull Over Push**: The design of my contract forces participants to
    explicitly claim/distribute funds ("pull") rather than somehow distributing
    them automatically.
- **Integer Overflow and Underflow (SWC-101)**: By limiting the totalSupply to
    `100 * (10 ** 18)`, I ensure that it is possible to multiply two balances
    together without overflowing a 256-bit integer. This is critical for
    calculating proportions without relying on a floating-point math library.
- **Function Default Visibility**: All methods have explicit visibility.
