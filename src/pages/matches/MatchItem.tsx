import React, { useEffect, useState } from "react";
import { API_ENDPOINT } from "../../config/constants";
import "./match.css";

interface Match {
  id: number;
  isRunning: boolean;
  name: string;
  location: string;
  score: { [teamName: string]: string };
  teams: { id: number; name: string }[];
  sportName: string;
}

interface MatchItemProps {
  matchId: number;
}

const MatchItem: React.FC<MatchItemProps> = ({ matchId }) => {
  const [match, setMatch] = useState<Match | null>(null);

  const fetchMatch = async (matchId: number) => {
    try {
      const response = await fetch(`${API_ENDPOINT}/matches/${matchId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setMatch(data);
    } catch (error) {
      console.error("Error fetching match:", error);
    }
  };

  useEffect(() => {
    fetchMatch(matchId);
  }, [matchId]);

  if (!match) {
    return <div>Loading...</div>;
  }

  const { sportName, location, teams, score } = match;

  return (
    <div className="bg-gradient-to-b from-purple-500 to-blue-500 text-white rounded-md p-3 shadow-md dark:bg-gradient-to-b dark:from-slate-700 dark:to-zinc-700 dark:text-white">
      <div className="flex justify-between">
        <h2 className="text-sm font-semibold mb-1">{sportName}</h2>
        <button
          type="button"
          id="refesh"
          name="refresh"
          onClick={() => {
            fetchMatch(matchId);
          }}
          className="rotate-on-hover"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="20"
            height="20"
            viewBox="0 0 26 26"
            fill="#f0f0f0"
          >
            <path d="M 13.8125 0 C 7.878906 0 4.082031 4.292969 4 10 L 0.5 10 C 0.300781 10 0.09375 10.113281 0.09375 10.3125 C -0.0078125 10.511719 -0.0078125 10.710938 0.09375 10.8125 L 6.09375 18.5 C 6.195313 18.601563 6.300781 18.6875 6.5 18.6875 C 6.699219 18.6875 6.804688 18.601563 6.90625 18.5 L 12.90625 10.8125 C 13.007813 10.710938 13.007813 10.511719 12.90625 10.3125 C 12.804688 10.113281 12.601563 10 12.5 10 L 9 10 C 9.066406 2.464844 12.921875 0.789063 13.8125 0.09375 C 14.011719 -0.0078125 14.011719 0 13.8125 0 Z M 19.5 7.34375 C 19.351563 7.34375 19.195313 7.398438 19.09375 7.5 L 13.09375 15.1875 C 12.992188 15.386719 13 15.585938 13 15.6875 C 13.101563 15.886719 13.304688 16 13.40625 16 L 17 16 C 16.933594 23.535156 13.078125 25.210938 12.1875 25.90625 C 11.988281 26.007813 11.988281 26 12.1875 26 C 18.121094 26 21.917969 21.707031 22 16 L 25.40625 16 C 25.605469 16 25.8125 15.886719 25.8125 15.6875 C 26.011719 15.488281 26.007813 15.289063 25.90625 15.1875 L 19.90625 7.5 C 19.804688 7.398438 19.648438 7.34375 19.5 7.34375 Z" />
          </svg>
        </button>
      </div>

      <p className="text-gray-200">{location}</p>
      <div className="mt-4">
        {teams.map((team) => (
          <div
            key={team.id}
            className="text-md text-white flex justify-between"
          >
            <span>{team.name}</span>
            <span className="font-semibold">{score[team.name]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchItem;
