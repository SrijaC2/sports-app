import { useEffect } from "react";
import { useMatchesDispatch } from "../../context/matches/context";
import { fetchMatches } from "../../context/matches/actions";
import { Outlet } from "react-router-dom";
import { usePreferencesDispatch } from "../../context/users/context";
import { fetchUserPreferences } from "../../context/users/actions";
import React, { Suspense } from "react";
const MatchList = React.lazy(() => import("./MatchList"));
import ErrorBoundary from "../../components/ErrorBoundary";

export default function LiveGames() {
  const dispatchMatches = useMatchesDispatch();
  const dispatchPreferences = usePreferencesDispatch();
  const isLoggedIn = !!localStorage.getItem("userData");
  useEffect(() => {
    fetchMatches(dispatchMatches);
    if (isLoggedIn) {
      fetchUserPreferences(dispatchPreferences);
    }
  }, [dispatchPreferences, dispatchMatches]);
  return (
    <>
      <div>
        <h2 className="text-xl font-bold ml-2">LiveGames</h2>
        <ErrorBoundary>
          <Suspense
            fallback={<div className="suspense-loading">Loading...</div>}
          >
            <MatchList />
          </Suspense>
        </ErrorBoundary>
      </div>
      <Outlet />
    </>
  );
}
