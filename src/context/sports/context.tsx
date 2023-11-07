import React, { createContext, useContext, useReducer } from "react";
import {
  sportsReducer,
  initialState,
  SportsState,
  SportsActions,
} from "./reducer";

const SportsStateContext = createContext<SportsState | undefined>(undefined);
type SportsDispatch = React.Dispatch<SportsActions>;
const SportsDispatchContext = createContext<SportsDispatch | undefined>(
  undefined
);

export const SportsProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(sportsReducer, initialState);
  return (
    <SportsStateContext.Provider value={state}>
      <SportsDispatchContext.Provider value={dispatch}>
        {children}
      </SportsDispatchContext.Provider>
    </SportsStateContext.Provider>
  );
};

export const useSportsState = () => useContext(SportsStateContext);
export const useSportsDispatch = () => useContext(SportsDispatchContext);
