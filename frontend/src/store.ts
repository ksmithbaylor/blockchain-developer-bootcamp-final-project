import create from 'zustand';
import { combine } from 'zustand/middleware';
import { Contract, utils } from 'ethers';
import {
  getParentContract,
  clonesFor,
  getCloneContract,
  balancesFor
} from './eth/contracts';

export type StoreState = {
  connected: boolean;
  parentContract: Contract | null;
  account: string | null;
  clones: string[];
  balances: Record<string, string>;
};

const initialState: StoreState = {
  connected: false,
  parentContract: null,
  account: null,
  clones: [],
  balances: {}
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
          set({ balances: await balancesFor(clones, account) });
        }
      }
    }
  }))
);

const actions = useStore.getState().actions;
const state = () => useStore.getState();
