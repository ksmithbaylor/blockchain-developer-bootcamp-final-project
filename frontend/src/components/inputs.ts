import styled, { css } from 'styled-components';

const common = css`
  display: block;
  border-radius: var(--border-radius-small);
  border: none;
  font-family: var(--font-mono);
  padding: 0.25em 0.5em;
  margin-bottom: 0.25rem;
`;

export const AddressInput = styled.input`
  ${common};
  width: 28em;
`;

export const NumberInput = styled.input`
  ${common};
  width: 14em;
`;
