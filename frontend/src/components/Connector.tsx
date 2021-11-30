import { useEffect } from 'react';
import { useEthers, ChainId } from '@usedapp/core';
import styled from 'styled-components';
import { Button } from './Button';

type Props = {
  onConnectionChange: (connected: boolean) => void;
};

export function Connector({ onConnectionChange }: Props) {
  const { activateBrowserWallet, deactivate, account, chainId } = useEthers();
  const connectedToRopsten = !!account && chainId === ChainId.Ropsten;

  const handleConnectClick = () => {
    activateBrowserWallet();
  };

  const handleDisconnectClick = () => {
    deactivate();
  };

  const handleSwitchToRopstenClick = async () => {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x' + ChainId.Ropsten.toString(16) }]
    });
  };

  useEffect(() => {
    onConnectionChange(connectedToRopsten);
  }, [connectedToRopsten]);

  if (!account) {
    return (
      <Container>
        <Button onClick={handleConnectClick}>Connect</Button>
        <Message>
          Welcome to the Revenue Token management interface!
          <br />
          Click "Connect" to continue.
        </Message>
      </Container>
    );
  }

  if (!connectedToRopsten) {
    return (
      <Container>
        <Button onClick={handleSwitchToRopstenClick}>Switch to Ropsten</Button>
        <Message>
          Only Ropsten is supported!
          <br />
          Click below to switch networks.
        </Message>
      </Container>
    );
  }

  return (
    <Container>
      <Button onClick={handleDisconnectClick}>Disconnect</Button>
      <Account>{account}</Account>
    </Container>
  );
}

const Container = styled.div`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Message = styled.p`
  margin-top: 1rem;
  text-align: center;
`;

const Account = styled.span`
  margin-top: 1rem;
  padding: 0.1em 0.4em;
  font-family: var(--font-mono);
  background: var(--color-accent);
  border-radius: var(--border-radius-small);
`;
