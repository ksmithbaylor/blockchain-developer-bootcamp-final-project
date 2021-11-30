const BASE_URL = 'https://ropsten.etherscan.io';

type Props = {
  path: string;
  children: React.ReactNode;
};

export function EtherscanLink({ path, children }: Props) {
  const href = BASE_URL + path;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={e => {
        e.stopPropagation();
      }}
    >
      {children}
    </a>
  );
}
