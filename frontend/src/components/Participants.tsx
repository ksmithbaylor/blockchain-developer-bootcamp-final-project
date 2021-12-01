import { utils } from 'ethers';
import { useToken, useContractCall, useContractCalls } from '@usedapp/core';
import { EtherscanLink } from './EtherscanLink';
import { useStore } from '../store';

type Props = {
  clone: string;
};

export function Participants({ clone }: Props) {
  const tokenInfo = useToken(clone);
  const participants = useParticipants(clone);

  if (!tokenInfo || !participants) {
    return null;
  }

  return (
    <td>
      {participants.map(({ address, balance }) => (
        <div key={address}>
          <EtherscanLink path={`/token/${clone}?a=${address}`}>
            {address}
          </EtherscanLink>{' '}
          {balance ? '(' + utils.formatEther(balance) + '%)' : null}
        </div>
      ))}
    </td>
  );
}

function useParticipants(address: string) {
  const parentContract = useStore(store => store.parentContract);
  const abi = parentContract.interface;
  const participantsParams = { abi, address, method: 'participants', args: [] };
  const participantsResult = useContractCall(participantsParams);
  const participants: string[] = participantsResult?.[0] || [];
  const balances = useContractCalls(
    participants.map(participant => ({
      abi,
      address,
      method: 'balanceOf',
      args: [participant]
    }))
  );

  return participants.map((participant, i) => ({
    address: participant,
    balance: balances[i]?.[0]
  }));
}
