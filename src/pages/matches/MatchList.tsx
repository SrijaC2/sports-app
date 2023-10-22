import { useState, useEffect } from "react";
import { useMatchesState } from "../../context/matches/context";
import MatchItem from "./MatchItem";
import { usePreferencesState } from "../../context/users/context";

export default function MatchList() {
  const matchState: any = useMatchesState();
  const { matches, isLoading, isError, errorMessage } = matchState;
  const [liveGames, setLiveGames] = useState(matches);

  const preferenceState: any = usePreferencesState();
  const authenticated = !!localStorage.getItem("userData");
  const fetchLiveGames = () => {
    if (!authenticated) {
      setLiveGames(
        matches?.filter((game: any) => {
          return game.isRunning;
        })
      );
    } else {
      if (
        preferenceState.preferences.preferredSport &&
        preferenceState.preferences.preferredTeams &&
        (preferenceState.preferences.preferredSport.length ||
          preferenceState.preferences.preferredTeams.length)
      ) {
        const userSports = preferenceState.preferences.preferredSport;
        const userTeams = preferenceState.preferences.preferredTeams;

        if (userSports.length || userTeams.length) {
          const filterGames = matches.filter(
            (match:any) =>
              match.isRunning &&
              (userSports.includes(match.sportName) ||
                userTeams.includes(match.teams[0].name) ||
                userTeams.includes(match.teams[1].name))
          );
          setLiveGames(filterGames);
        }
      } else {
        setLiveGames(
          matches?.filter((game: any) => {
            return game.isRunning;
          })
        );
      }
    }
  };
  useEffect(() => {
    fetchLiveGames();
  }, [isLoading, authenticated, preferenceState]);

  if (isError) {
    return <span>{errorMessage}</span>;
  }
  if (liveGames && liveGames.length) {
    return (
      <div className="flex overflow-x-auto overflow-hidden">
        <div className="flex-shrink-0 w-full max-w-screen-xl overflow-x-auto">
          <div className="flex space-x-2 p-1">
            {!isLoading &&
              liveGames.map((game: any) => {
                return (
                  <div key={game.id} className="flex-shrink-0 rounded-md">
                    <MatchItem matchId={game.id} />
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    );
  } else {
    return <span>No live matches found</span>;
  }
}
