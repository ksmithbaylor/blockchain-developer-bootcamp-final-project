import styled from 'styled-components';

const BASE_URL = 'https://ropsten.etherscan.io';

type Props = {
  path: string;
  variable?: boolean;
  children: React.ReactNode;
};

export function EtherscanLink({ path, variable, children }: Props) {
  const href = BASE_URL + path;
  return (
    <Link
      $variable={variable}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={e => {
        e.stopPropagation();
      }}
    >
      {children}
    </Link>
  );
}

const Link = styled.a<{ $variable?: boolean }>`
  font-family: ${props => (props.$variable ? 'inherit' : 'var(--font-mono)')};
`;
