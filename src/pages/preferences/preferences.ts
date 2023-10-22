import { API_ENDPOINT } from "../../config/constants";
export interface PreferancesList {
  preferredSport: string[];
  preferredTeams: string[];
}
export type FinalList = {
  preferences: PreferancesList;
  errors?: string[];
};

export const PatchPreferences = async (preferences: PreferancesList) => {
  const token: string | null = localStorage.getItem("authToken");
  const response = await fetch(`${API_ENDPOINT}/user/preferences`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ preferences: preferences }),
  });
  const data = await response.json();
  if (response.ok) {
    FetchPreferences();
  } else {
    if (data.errors.includes("Invalid auth token")) {
      throw new Error(`${data.errors}`);
    } else {
      throw new Error("Failed to add preferances");
    }
  }
};

export const FetchPreferences = async () => {
  const token: string | null = localStorage.getItem("authToken");
  const response = await fetch(`${API_ENDPOINT}/user/preferences`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const listitems: FinalList = await response.json();
  return listitems;
};
