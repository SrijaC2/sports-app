import React, { useEffect, Suspense } from "react";
import { fetchSports } from "../../context/sports/actions";
import { fetchTeams } from "../../context/teams/actions";
import { useSportsDispatch } from "../../context/sports/context";
import { useTeamsDispatch } from "../../context/teams/context";
// import PreferencesL from "./PreferenceList";
// import PreferencesProvider from "../../context/users/context"
import { usePreferencesDispatch } from "../../context/users/context";
import { fetchUserPreferences } from "../../context/users/actions";
const PreferencesL = React.lazy(() => import("./PreferenceList"));
import ErrorBoundary from "../../components/ErrorBoundary";

const ProjectList: React.FC = () => {
  const dispatchSports = useSportsDispatch();
  const dispatchTeams = useTeamsDispatch();
  const disptachPreferences = usePreferencesDispatch();

  useEffect(() => {
    fetchSports(dispatchSports);
    fetchTeams(dispatchTeams);
    fetchUserPreferences(disptachPreferences);
  }, [dispatchSports, dispatchTeams, disptachPreferences]);
  return (
    <div>
      <ErrorBoundary>
        <Suspense fallback={<div className="suspense-loading">Loading...</div>}>
          <PreferencesL />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};
export default ProjectList;
