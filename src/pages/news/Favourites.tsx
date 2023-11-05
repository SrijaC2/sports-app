import { Fragment, useState, useEffect } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { useNewsState } from "../../context/news/context";
import { useSportsState } from "../../context/sports/context";
import { useTeamsState } from "../../context/teams/context";
import { Link } from "react-router-dom";
import { usePreferencesState } from "../../context/users/context";

export default function Favourites() {
  const State: any = useNewsState();
  const { news, isLoading, isError, errorMessage } = State;
  const sportsState: any = useSportsState();
  const { sports } = sportsState;
  const teamsState: any = useTeamsState();
  const { teams } = teamsState;
  const preferenceState: any = usePreferencesState();
  const [filteredSports, setfilteredSports] = useState(sports);
  // console.log("filteredSports",filteredSports)
  const [filteredTeams, setfilteredTeams] = useState(sports);
  // console.log("filteredTeams",filteredTeams)
  const [resultantNews, setResultantNews] = useState(news);
  const authenticated = !!localStorage.getItem("userData");
  const [selectedSport, setSelectedSport] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");

  const fetchFavourites = () => {
    if (!authenticated) {
      setfilteredSports(sports);
      setfilteredTeams(teams);
      setResultantNews(news);
    } else {
      if (
        preferenceState.preferences.preferredSport &&
        preferenceState.preferences.preferredTeams &&
        (preferenceState.preferences.preferredSport.length ||
          preferenceState.preferences.preferredTeams.length)
      ) {
        const userSports = preferenceState.preferences.preferredSport;
        const userTeams = preferenceState.preferences.preferredTeams;
        if (userSports.length) {
          const filterUserSports = sports.filter((sport: any) =>
            userSports.includes(sport.name)
          );
          setfilteredSports(filterUserSports);
        } else {
          setfilteredSports(sports);
        }

        if (userTeams.length) {
          const filterUserTeams = teams.filter((team: any) =>
            userTeams.includes(team.name)
          );
          setfilteredTeams(filterUserTeams);
        } else {
          setfilteredTeams(teams);
        }

        if (userSports.length || userTeams.length) {
          const filterNews = news.filter((news) => {
            const sportName = news.sport.name;
            const teamNames = Array.isArray(news.teams)
              ? news.teams.map((team) => team.name)
              : [];

            return (
              userSports.includes(sportName) ||
              teamNames.some((teamName) => userTeams.includes(teamName))
            );
          });
          setResultantNews(filterNews);
        }
      } else {
        setfilteredSports(sports);
        setfilteredTeams(teams);
        setResultantNews(news);
      }
    }
  };
  useEffect(() => {
    fetchFavourites();
  }, [isLoading, news, authenticated, preferenceState]);

  const filteredNews = resultantNews.filter((newsItem) => {
    const sportMatched = selectedSport
      ? newsItem.sport.name === selectedSport
      : true; // true if selectedSport is empty or null

    const teamMatched = selectedTeam
      ? newsItem.teams.some((team) => team.name === selectedTeam)
      : true; // true if selectedTeam is empty or null

    return sportMatched && teamMatched;
  });
  console.log("filteredNews", filteredNews);

  if (news.length === 0 && isLoading) {
    return <span>Loading...</span>;
  }
  if (isError) {
    return <span>{errorMessage}</span>;
  }

  const SortedTeams = selectedSport
    ? filteredTeams.filter((team) => team.plays === selectedSport)
    : filteredTeams;

  return (
    <div className="bg-gradient-to-br from-blue-500 to-purple-500 text-white p-3 rounded dark:bg-gradient-to-b dark:from-slate-700 dark:to-zinc-800">
      <div className="text-2xl font-semibold mb-4">Favourites</div>

      <div className="mb-4">
        <Listbox value={selectedSport} onChange={setSelectedSport}>
          {({ open }) => (
            <>
              <div className="relative mt-1">
                <Listbox.Button className="relative text-md dark:bg-slate-800 dark:text-white w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm text-gray-900">
                  <span className="block truncate">
                    {selectedSport ? selectedSport : "Favourite Sport"}
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  show={open}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                    {filteredSports.map((sport, id) => (
                      <Listbox.Option
                        key={id}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active
                              ? "bg-teal-400 text-teal-900 dark:bg-slate-400 dark:text-gray-900"
                              : "text-gray-900"
                          }`
                        }
                        value={sport.name}
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? "font-medium" : "font-normal"
                              }`}
                            >
                              {sport.name}
                            </span>
                            {selected && (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-900">
                                <CheckIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </span>
                            )}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </>
          )}
        </Listbox>
      </div>

      <div>
        <Listbox value={selectedTeam} onChange={setSelectedTeam}>
          {({ open }) => (
            <>
              <div className="relative  mt-1">
                <Listbox.Button className="relative text-md dark:bg-slate-800 dark:text-white w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm text-gray-900">
                  <span className="block truncate">
                    {selectedTeam ? selectedTeam : "Favourite Team"}
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  show={open}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                    {SortedTeams.map((team, id) => (
                      <Listbox.Option
                        key={id}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active
                              ? "bg-teal-400 text-teal-900 dark:bg-slate-400 dark:text-gray-900"
                              : "text-gray-900"
                          }`
                        }
                        value={team.name}
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? "font-medium" : "font-normal"
                              }`}
                            >
                              {team.name}
                            </span>
                            {selected && (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-900">
                                <CheckIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </span>
                            )}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </>
          )}
        </Listbox>
      </div>
      <div className="mt-2 overflow-y-auto" style={{ maxHeight: "calc(97vh - 150px)" }}>
  {filteredNews.length === 0 ? (
    <p className="flex p-4 m-1 mb-2 bg-slate-400 dark:text-white text-black font-medium border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
      <div className="flex-grow">
            No News Article Found
      </div>
    </p>
  ) : (
    filteredNews.map((news: any) => (
      <div
        key={news.id}
        className="flex p-3 m-1 mb-2 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
      >
        <div className="flex-grow">
          <h2 className="text-black font-bold text-lg dark:text-white mb-2 ">
            {news.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 line-clamp-3">
            {news.summary}
          </p>
          <div className="text-center">
            <Link to={`/articles/${news.id}`}>
              <button className="w-full dark:text-gray-800 font-medium dark:hover:bg-zinc-100 text-white dark:bg-white bg-blue-900 hover:bg-blue-700 p-2 rounded-md text-sm focus:outline-none">
                Read more
              </button>
            </Link>
          </div>
        </div>
      </div>
    ))
  )}
</div>
    </div>
  );
}
