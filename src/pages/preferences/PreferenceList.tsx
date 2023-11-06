import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useSportsState } from "../../context/sports/context";
import { useTeamsState } from "../../context/teams/context";
import { Sport } from "../../context/sports/reducer";
import { Team } from "../../context/teams/reducer";
import { usePreferencesDispatch } from "../../context/users/context";
import { setUserPreferences } from "../../context/users/actions";

import {
  PreferancesList,
  FinalList,
  FetchPreferences,
  PatchPreferences,
} from "./preferences";
type Inputs = {
  name: string;
};

const PreferencesL = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [error] = useState(null);
  const dispatchPreferences = usePreferencesDispatch();

  const sportsState: any = useSportsState();
  const { sports, isLoading1, isError1, errorMessage1 } = sportsState;

  const teamsState: any = useTeamsState();
  const { teams, isLoading2, isError2, errorMessage2 } = teamsState;

  const [preferances, setPreferances] = useState<PreferancesList>({
    preferredSport: [],
    preferredTeams: [],
  });

  const { handleSubmit } = useForm<Inputs>();

  const closeModal = () => {
    setIsOpen(false);
  };
  const openModal = () => {
    setIsOpen(true);
  };
  const onSubmit: SubmitHandler<Inputs> = async () => {
    PatchPreferences(preferances);
    await setUserPreferences(dispatchPreferences, preferances);
    closeModal();
  };
  const isLoggedIn = !!localStorage.getItem("userData");
  useEffect(() => {
    if (isLoggedIn) {
      FetchPreferences()
        .then((data: FinalList) => {
          if (Object.keys(data.preferences).length !== 0) {
            setPreferances(data.preferences);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [isLoggedIn]);

  const handleSportClick = (sportName: string) => {
    const newPreferredSports = [...preferances.preferredSport];
    const index = newPreferredSports.indexOf(sportName);

    if (index === -1) {
      newPreferredSports.push(sportName);
    } else {
      newPreferredSports.splice(index, 1);
    }
    setPreferances({
      ...preferances,
      preferredSport: newPreferredSports,
    });
  };

  const handleTeamClick = (teamName: string) => {
    const newPreferredTeams = [...preferances.preferredTeams];
    const index = newPreferredTeams.indexOf(teamName);
    if (index === -1) {
      newPreferredTeams.push(teamName);
    } else {
      newPreferredTeams.splice(index, 1);
    }
    setPreferances({
      ...preferances,
      preferredTeams: newPreferredTeams,
    });
  };

  if (isError1) {
    return <span>{errorMessage1}</span>;
  }
  if (isError2) {
    return <span>{errorMessage2}</span>;
  }

  return (
    <>
      <div>
        <button
          type="button"
          onClick={openModal}
          className="rounded-full bg-white p-1 ml-3 text-gray-400 hover:text-blue-600"
        >
          <Cog6ToothIcon className="h-7 w-7" aria-hidden="true" />
        </button>
      </div>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <div>
                  <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-slate-800 dark:text-zinc-50">
                    <div className="flex items-center justify-between">
                      <Dialog.Title
                        as="h3"
                        className="text-xl font-medium leading-6 text-black"
                      >
                        Preferences
                      </Dialog.Title>
                      <button
                        type="button"
                        onClick={closeModal}
                        className="rounded-full bg-white p-1 ml-3 text-gray-800 hover:text-blue-600"
                      >
                        <XMarkIcon className="h-7 w-7" aria-hidden="true" />
                      </button>
                    </div>

                    <div className="mt-2">
                      <form onSubmit={handleSubmit(onSubmit)}>
                        {error && <span>{error}</span>}
                        <h2 className="border-b border-gray-600 dark:border-white pb-2 font-medium">
                          Favorite Sports
                        </h2>
                        <div>
                          <div className="flex flex-wrap p-3">
                            {!isLoading1 &&
                              sports.map((sportitem: Sport) => (
                                <div
                                  key={sportitem.id}
                                  className={`flex m-2 items-center w-36 rounded-lg p-3 cursor-pointer ${
                                    preferances?.preferredSport?.includes(
                                      sportitem.name
                                    )
                                      ? "bg-teal-500 text-white"
                                      : "bg-white text-black"
                                  }`}
                                  onClick={() =>
                                    handleSportClick(sportitem.name)
                                  }
                                >
                                  {sportitem.name}
                                  {preferances?.preferredSport?.includes(
                                    sportitem.name
                                  ) && (
                                    <span className="ml-2 text-lg font-bold">
                                      &#10003;
                                    </span>
                                  )}
                                </div>
                              ))}
                          </div>
                        </div>
                        <h2 className="border-b border-gray-600 dark:border-white pb-2 font-medium">
                          Favorite Teams
                        </h2>
                        <div>
                          <div className="flex flex-wrap p-3">
                            {!isLoading2 &&
                              teams.map((teamitem: Team) => (
                                <div
                                  key={teamitem.id}
                                  className={`flex m-2 items-center w-36 rounded-lg p-3 cursor-pointer ${
                                    preferances?.preferredTeams?.includes(
                                      teamitem.name
                                    )
                                      ? "bg-purple-500 text-white"
                                      : "bg-white text-black"
                                  }`}
                                  onClick={() => handleTeamClick(teamitem.name)}
                                >
                                  {teamitem.name}
                                  {preferances?.preferredTeams?.includes(
                                    teamitem.name
                                  ) && (
                                    <span className="ml-2 text-lg font-bold">
                                      &#10003;
                                    </span>
                                  )}
                                </div>
                              ))}
                          </div>
                        </div>
                        <button
                          type="submit"
                          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-3 mr-2  ml-3 text-sm font-medium text-white hover:bg-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        >
                          Submit
                        </button>
                      </form>
                    </div>
                  </Dialog.Panel>
                </div>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
export default PreferencesL;
