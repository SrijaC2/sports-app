import { useNewsState } from "../../context/news/context";
import { useSportsState } from "../../context/sports/context";
import { Tab } from "@headlessui/react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { usePreferencesState } from "../../context/users/context";

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
          const filterNews = news.filter((news:any) =>
            userSports.includes(news.sport.name)
          );
          setResultantNews(filterNews);
          const filterUserSports = sports.filter((sport:any) =>
            userSports.includes(sport.name)
          );
          setfilteredSports(filterUserSports);
        }
      } else {
        setResultantNews(news);
        setfilteredSports(sports);
      }
    }
  };
  useEffect(() => {
    fetchNews();
  }, [isLoading, news, authenticated, preferenceState]);

  if (news.length === 0 && isLoading) {
    return <span>Loading...</span>;
  }
  if (isError) {
    return <span>{errorMessage}</span>;
  }

  function filterNewsBySport(sportID:any) {
    return news.filter((item:any) => item.sport.id === sportID);
  }
  function formattedDate(isoDate:string) {
    const date = new Date(isoDate);
    return date.toDateString();
  }

  const handleTabChange = (index:number) => {
    setSelectedTabIndex(index);
    if (index == 0) {
      fetchNews();
    } else {
      const filteredNews = filterNewsBySport(filteredSports[index - 1].id);
      setResultantNews(filteredNews);
    }
  };
  return (
    <>
      <div className="bg-gradient-to-br from-blue-400 to-teal-400 dark:bg-gradient-to-b dark:from-slate-700 dark:to-zinc-800 rounded">
        <Tab.Group defaultIndex={0} onChange={handleTabChange}>
          <Tab.List className="flex p-4 pb-2 space-x-4">
            <Tab
              key={0}
              className={`px-6 py-2 text-sm font-medium   rounded focus:outline-none ${
                selectedTabIndex === 0
                  ? "bg-purple-500 text-white dark:bg-white dark:text-gray-500"
                  : "bg-gray-100 text-gray-600 hover:text-blue-500 dark:bg-slate-800 dark:text-white dark:hover:text-blue-300"
              }`}
            >
              Your News
            </Tab>
            {filteredSports.map((sport:any, index:number) => (
              <Tab
                key={sport.id}
                className={`px-6 py-3 text-sm font-medium   rounded focus:outline-none ${
                  selectedTabIndex === index + 1
                    ? "bg-purple-500 text-white dark:bg-white dark:text-gray-500"
                    : "bg-gray-100 text-gray-600 hover:text-blue-500 dark:bg-slate-800 dark:text-white dark:hover:text-blue-300"
                }`}
              >
                {sport.name}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel key={0}>
              <div
                className="p-4 overflow-y-auto"
                style={{ maxHeight: "calc(100vh - 150px)" }}
              >
                {resultantNews.map((news: any) => (
                  <div
                    key={news.id}
                    className="flex p-4 m-1 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                  >
                    <div className="flex-shrink-0 pr-4">
                      <img
                        src={news.thumbnail}
                        alt="Thumbnail"
                        className="w-24 h-24 object-cover "
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
                ))}
              </div>
            </Tab.Panel>
            {filteredSports.map((sport:any) => (
              <Tab.Panel key={sport.id}>
                <div
                  className="p-4 overflow-y-auto"
                  style={{ maxHeight: "calc(100vh - 150px)" }}
                >
                  {resultantNews.map((news: any) => (
                    <div
                      key={news.id}
                      className="flex p-4 m-1 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                    >
                      <div className="flex-shrink-0 pr-4">
                        <img
                          src={news.thumbnail}
                          alt="Thumbnail"
                          className="w-24 h-24 object-cover "
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
                  ))}
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
