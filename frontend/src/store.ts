import create from 'zustand';
import { combine } from 'zustand/middleware';
import { Contract } from 'ethers';
import { getParentContract, clonesFor } from './eth/contracts';

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
        const numClonesBefore = state().clones.length;
        if (account) {
          while (true) {
            const clones = await clonesFor(account);
            if (clones.length !== numClonesBefore) {
              set({ clones });
              break;
            } else {
              await sleep(2000);
            }
          }
        }
      },
      selectClone: (address: string | null) => {
        set({ activeClone: address });
      }
    }
  }))
);

const actions = useStore.getState().actions;
const state = () => useStore.getState();
const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));
