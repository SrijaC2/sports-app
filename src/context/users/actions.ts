import { API_ENDPOINT } from "../../config/constants";

export const fetchUserPreferences = async (dispatch: any) => {
  try {
    dispatch({ type: "FETCH_PREFERENCES_REQUEST" });
    const token = localStorage.getItem("authToken");
    if (!token) {
      throw new Error("User is not authenticated");
    }
    const response = await fetch(`${API_ENDPOINT}/user/preferences`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    dispatch({ type: "FETCH_PREFERENCES_SUCCESS", payload: data?.preferences });
  } catch (error) {
    console.log("Error fetching preferences:", error);
    dispatch({
      type: "FETCH_PREFERENCES_FAILURE",
      payload: "Unable to load preferences",
    });
  }
};

export const setUserPreferences = async (dispatch: any, args: any) => {
  try {
    dispatch({ type: "SET_PREFERENCES_REQUEST" });

    const token = localStorage.getItem("authToken") ?? "";
    const response = await fetch(`${API_ENDPOINT}/user/preferences`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(args),
    });

    if (!response.ok) {
      throw new Error("Failed to set preferences");
    }

    const data = await response.json();
    if (data.errors && data.errors.includes("Invalid auth token")) {
      throw new Error("Invalid auth token");
    }

    dispatch({ type: "SET_PREFERENCES_SUCCESS", payload: data?.preferences });
    return { ok: true };
  } catch (error) {
    console.error("Error setting preferences:", error);
    return { ok: false, error: "Unable to set preferences" };
  }
};
