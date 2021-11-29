import { createContext, useContext } from 'react';
import { Contract } from 'ethers';

type DappContextValue = {
  parentContract: Contract | null;
};

const initialState: DappContextValue = {
  parentContract: null
};

export const DappContext = createContext<DappContextValue>(initialState);
export const useDappContext = () => useContext(DappContext);
