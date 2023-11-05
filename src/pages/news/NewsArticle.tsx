import { useNewsState } from "../../context/news/context";
import { useSportsState } from "../../context/sports/context";
import { Tab } from "@headlessui/react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { usePreferencesState } from "../../context/users/context";
import { FunnelIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

const NewsArticle = () => {
  const State: any = useNewsState();
  const { news, isLoading, isError, errorMessage } = State;
  const sportsState: any = useSportsState();
  const { sports } = sportsState;
  const preferenceState: any = usePreferencesState();
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [filteredSports, setfilteredSports] = useState(sports);
  const [resultantNews, setResultantNews] = useState(news);
  const authenticated = !!localStorage.getItem("userData");

  const items = [
    { id: 1, name: "Title" },
    { id: 2, name: "Date" },
    { id: 3, name: "Sport" },
  ];
  const [selectOption, setSelectOption] = useState("");
  const [filterOption, setFilterOption] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  // console.log(filterOption);

  const fetchNews = () => {
    if (!authenticated) {
      setResultantNews(news);
      setfilteredSports(sports);
    } else {
      if (
        preferenceState.preferences.preferredSport &&
        preferenceState.preferences.preferredSport.length
      ) {
        const userSports = preferenceState.preferences.preferredSport;
        if (userSports.length) {
          const filterNews = news.filter((news: any) =>
            userSports.includes(news.sport.name)
          );

          setResultantNews(filterNews);
          const filterUserSports = sports.filter((sport: any) =>
            userSports.includes(sport.name)
          );
          setfilteredSports(filterUserSports);
        }
      } else {
        setResultantNews(news);
        setfilteredSports(sports);
      }
    }
    if (selectedTabIndex>0 ){
      setSelectedTabIndex(0)
      }
  };
  useEffect(() => {
    fetchNews();
  }, [isLoading, news, authenticated, preferenceState]);

  function sortNewsByFilterOption(news: any, filterOption) {
    return [...news].sort((a, b) => {
      if (filterOption === "Title") {
        return a.title.localeCompare(b.title);
      } else if (filterOption === "Date") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (filterOption === "Sport") {
        return a.sport.name.localeCompare(b.sport.name);
      }
      return 0;
    });
  }

  if (news.length === 0 && isLoading) {
    return <span>Loading...</span>;
  }
  if (isError) {
    return <span>{errorMessage}</span>;
  }

  function filterNewsBySport(sportID: any) {
    return news.filter((item: any) => item.sport.id === sportID);
  }
  function formattedDate(isoDate: string) {
    const date = new Date(isoDate);
    return date.toDateString();
  }

  const handleTabChange = (index: number) => {
    setSelectedTabIndex(index);
    if (index == 0) {
      fetchNews();
    } else {
      const filteredNews = filterNewsBySport(filteredSports[index - 1].id);
      setResultantNews(filteredNews);
    }
  };

  const handleSelect = (selectedItem: any) => {
    setSelectOption(selectedItem.name);
    setIsOpen(false);
  };
  const handleFilter = (selectedItem: any) => {
    setFilterOption(selectedItem);
  };
  
  const sortedNews = sortNewsByFilterOption(resultantNews, filterOption);
  return (
    <>
      <div className="bg-gradient-to-br from-blue-400 to-teal-400 dark:bg-gradient-to-b dark:from-slate-700 dark:to-zinc-800 rounded">
        <Tab.Group defaultIndex={0} onChange={handleTabChange}>
          <div className="flex justify-between">
            <Tab.List className="flex p-4 pb-2  overflow-x-auto">
              <Tab
                key={0}
                className={`px-4 py-2 mr-3 text-sm font-medium rounded focus:outline-none ${
                  selectedTabIndex === 0
                    ? "bg-purple-500 text-white dark:bg-white dark:text-gray-500"
                    : "bg-gray-100 text-gray-600 hover:text-blue-500 dark:bg-slate-800 dark:text-white dark:hover:text-blue-300"
                }`}
              >
                Your News
              </Tab>
              {filteredSports.map((sport: any, index: number) => (
                <Tab
                  key={sport.id}
                  className={`px-4 py-2 mr-3 text-sm font-medium   rounded focus:outline-none ${
                    selectedTabIndex === index + 1
                      ? "bg-purple-500 text-white dark:bg-white dark:text-gray-500"
                      : "bg-gray-100 text-gray-600 hover:text-blue-500 dark:bg-slate-800 dark:text-white dark:hover:text-blue-300"
                  }`}
                >
                  {sport.name}
                </Tab>
              ))}
            </Tab.List>

            <div className="flex items-center p-5 pb-2 ">
              <div className="relative">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="inline-flex mr-2 px-4 py-4 text-sm font-medium rounded focus:outline-none bg-gray-100 text-gray-600 hover:text-blue-500 dark:bg-slate-800 dark:text-white dark:hover:text-blue-300"
                >
                  {selectOption || "SortBy"}
                  <ChevronDownIcon
                    className="ml-2 -mr-1 h-5 w-5 text-violet-400 hover:text-violet-300 dark:bg-slate-800 dark:text-white"
                    aria-hidden="true"
                  />
                </button>
                {isOpen && (
                  <div className="absolute right-0 mt-2 py-2 bg-white border border-gray-300 rounded shadow-lg dark:bg-slate-800 dark:text-white">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="cursor-pointer px-7 py-3 hover:bg-gray-100 text-sm dark:hover:bg-gray-700"
                        onClick={() => handleSelect(item)}
                      >
                        {item.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <span
                className="px-3 py-4 bg-gray-100 rounded dark:bg-slate-800"
                onClick={() => handleFilter(selectOption)}
              >
                <FunnelIcon className="h-5 w-5" />
              </span>
            </div>
          </div>

          <Tab.Panels>
            <Tab.Panel key={0}>
              <div
                className="p-4 overflow-y-auto mb-2"
                style={{ maxHeight: "calc(112vh - 150px)" }}
              >
                {sortedNews.length === 0 ? (
                  <p className="flex p-4 m-1 mb-2 bg-slate-400 dark:text-white text-black font-medium border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                    <div className="flex-grow">No Trending News Found</div>
                  </p>
                ) : (
                  sortedNews.map((news: any) => (
                    <div
                      key={news.id}
                      className="flex p-4 m-1 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                    >
                      <div className="flex-shrink-0 pr-4">
                        <img
                          src={news.thumbnail}
                          alt="Thumbnail"
                          className="w-24 h-24 object-cover rounded"
                        />
                      </div>
                      <div className="flex-grow">
                        <h5 className="mb-1 text-sm text-gray-600 dark:text-gray-400 font-medium">
                          {news.sport.name}
                        </h5>
                        <h2 className="text-lg font-bold">{news.title}</h2>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          {news.summary}
                        </p>
                        <div className="flex justify-between">
                          <p className="text-sm text-gray-500 dark:text-gray-300">
                            {formattedDate(news.date)}
                          </p>
                          <Link to={`/articles/${news.id}`}>
                            <h5 className="text-sm text-gray-500 dark:text-gray-300 hover:text-blue-400">
                              Read more...
                            </h5>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Tab.Panel>
            {filteredSports.map((sport: any) => (
              <Tab.Panel key={sport.id}>
                <div
                  className="p-4 overflow-y-auto"
                  style={{ maxHeight: "calc(112vh - 150px)" }}
                >
                  {sortedNews.length === 0 ? (
                    <p className="flex p-4 m-1 mb-2 bg-slate-400 dark:text-white text-black font-medium border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                      <div className="flex-grow">No Trending News Found</div>
                    </p>
                  ) : (
                    sortedNews.map((news: any) => (
                      <div
                        key={news.id}
                        className="flex p-4 m-1 bg-white border border-gray-200 rounded-lg shadow hover-bg-gray-100 dark-bg-gray-800 dark-border-gray-700 dark-hover-bg-gray-700"
                      >
                        <div className="flex-shrink-0 pr-4">
                          <img
                            src={news.thumbnail}
                            alt="Thumbnail"
                            className="w-24 h-24 object-cover rounded"
                          />
                        </div>
                        <div className="flex-grow">
                          <h5 className="mb-1 text-sm text-gray-600 dark-text-gray-400 font-medium">
                            {news.sport.name}
                          </h5>
                          <h2 className="text-lg font-bold">{news.title}</h2>
                          <p className="text-gray-600 dark-text-gray-400 text-sm">
                            {news.summary}
                          </p>
                          <div className="flex justify-between">
                            <p className="text-sm text-gray-500 dark-text-gray-300">
                              {formattedDate(news.date)}
                            </p>
                            <Link to={`/articles/${news.id}`}>
                              <h5 className="text-sm text-gray-500 dark-text-gray-300 hover-text-blue-400">
                                Read more...
                              </h5>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>
    </>
  );
};

export default NewsArticle;