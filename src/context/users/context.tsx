import React, { createContext, useContext, useReducer } from "react";
import {
  preferencesReducer,
  initialPreferencesState,
  PreferencesState,
  PreferencesActions,
} from "./reducer";

const PreferencesStateContext = createContext<PreferencesState | undefined>(
  undefined
);
type PreferencesDispatch = React.Dispatch<PreferencesActions>;
const PreferencesDispatchContext = createContext<
  PreferencesDispatch | undefined
>(undefined);

export const PreferencesProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(
    preferencesReducer,
    initialPreferencesState
  );
  return (
    <PreferencesStateContext.Provider value={state}>
      <PreferencesDispatchContext.Provider value={dispatch}>
        {children}
      </PreferencesDispatchContext.Provider>
    </PreferencesStateContext.Provider>
  );
};

export const usePreferencesState = () => useContext(PreferencesStateContext);
export const usePreferencesDispatch = () =>
  useContext(PreferencesDispatchContext);
