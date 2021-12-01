import create from 'zustand';
import { combine } from 'zustand/middleware';
import { Contract, utils } from 'ethers';
import {
  getParentContract,
  getCloneContract,
  clonesFor
} from './eth/contracts';

export type StoreState = {
  connected: boolean;
  parentContract: Contract;
  account: string | null;
  clones: string[];
  activeClone: string | null;
  tokens: string[];
  pendingTx: string | null;
};

const initialState: StoreState = {
  connected: false,
  parentContract: getParentContract(),
  account: null,
  clones: [],
  activeClone: null,
  tokens: [],
  pendingTx: null
};

export const useStore = create(
  combine(initialState, set => ({
    actions: {
      connected: async (account: string) => {
        set({ account, connected: true, parentContract: getParentContract() });
        await actions.refresh();
      },
      disconnected: () => {
        set(initialState);
      },
      refresh: async () => {
        const account = state().account;
        if (account) {
          const clones = await clonesFor(account);
          set({ clones });
        }
      },
      selectClone: (address: string | null) => {
        set({ activeClone: address });
      },
      addParticipant: async (params: {
        clone: string;
        participant: string;
        amount: string;
      }) => {
        const clone = getCloneContract(params.clone);
        const tx = await clone.addParticipant(
          params.participant,
          utils.parseEther(params.amount)
        );
        set({ pendingTx: tx });
        console.log(tx);
        const receipt = await tx.wait();
        console.log(receipt);
        set({ pendingTx: null });
      }
    }
  }))
);

const actions = useStore.getState().actions;
const state = () => useStore.getState();
