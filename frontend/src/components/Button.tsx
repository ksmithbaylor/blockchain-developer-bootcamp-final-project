import styled from 'styled-components';

export const Button = styled.button`
  padding: 0.25em 0.5em;
  border-radius: var(--border-radius-med);
  box-shadow: var(--shadow-elevation-low);
  background: var(--color-primary-bg);
  color: var(--color-text-dark);
  border: none;

  :hover {
    box-shadow: var(--shadow-elevation-medium);
    background: var(--color-primary-bg-light);
  }
`;
