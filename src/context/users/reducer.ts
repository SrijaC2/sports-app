// preferences.ts

export interface UserPreferences {
  preferredSport: string[];
  preferredTeams: string[];
}

export interface PreferencesState {
  // preferences: UserPreferences | null;
  preferences: UserPreferences ;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
}

export type PreferencesActions =
  | { type: "FETCH_PREFERENCES_REQUEST" }
  | { type: "FETCH_PREFERENCES_SUCCESS"; payload: UserPreferences }
  | { type: "FETCH_PREFERENCES_FAILURE"; payload: string }
  | { type: "SET_PREFERENCES_REQUEST" }
  | { type: "SET_PREFERENCES_SUCCESS"; payload: UserPreferences }
  | { type: "SET_PREFERENCES_FAILURE"; payload: string };

export const initialPreferencesState: PreferencesState = {
  preferences:  {
    preferredSport: [],
    preferredTeams: []
  },
  isLoading: false,
  isError: false,
  errorMessage: "",
};

export const preferencesReducer = (
  state: PreferencesState = initialPreferencesState,
  action: PreferencesActions
): PreferencesState => {
  switch (action.type) {
    case "FETCH_PREFERENCES_REQUEST":
      return {
        ...state,
        isLoading: true,
      };
    case "FETCH_PREFERENCES_SUCCESS":
      return {
        ...state,
        isLoading: false,
        preferences: action.payload,
      };
    case "FETCH_PREFERENCES_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true,
        errorMessage: action.payload,
      };
    case "SET_PREFERENCES_REQUEST":
      return {
        ...state,
        isLoading: true,
      };
    case "SET_PREFERENCES_SUCCESS":
      return {
        ...state,
        isLoading: false,
        preferences: action.payload,
      };
    case "SET_PREFERENCES_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true,
        errorMessage: action.payload,
      };
    default:
      return state;
  }
};
