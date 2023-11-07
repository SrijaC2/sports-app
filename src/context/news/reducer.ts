export interface Sport {
  id: number;
  name: string;
}

export interface Team {
  id: number;
  name: string;
}

export interface News {
  id: number;
  title: string;
  thumbnail: string;
  sport: Sport;
  date: string;
  summary: string;
  teams: Team[];
}

export interface NewsState {
  news: News[];
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
}

export type NewsActions =
  | { type: "FETCH_NEWS_REQUEST" }
  | { type: "FETCH_NEWS_SUCCESS"; payload: News[] }
  | { type: "FETCH_NEWS_FAILURE"; payload: string };

export const initialState: NewsState = {
  news: [],
  isLoading: false,
  isError: false,
  errorMessage: "",
};

export const newsReducer = (
  state: NewsState = initialState,
  action: NewsActions
): NewsState => {
  switch (action.type) {
    case "FETCH_NEWS_REQUEST":
      return {
        ...state,
        isLoading: true,
      };
    case "FETCH_NEWS_SUCCESS":
      return {
        ...state,
        isLoading: false,
        news: action.payload,
      };
    case "FETCH_NEWS_FAILURE":
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
