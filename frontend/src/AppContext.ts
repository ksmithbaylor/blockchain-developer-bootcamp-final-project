import { createContext, useContext } from 'react';
import { Contract } from 'ethers';

type AppContextValue = {
  parentContract: Contract | null;
};

const initialState: AppContextValue = {
  parentContract: null
};

export const AppContext = createContext<AppContextValue>(initialState);
export const useAppContext = () => useContext(AppContext);
