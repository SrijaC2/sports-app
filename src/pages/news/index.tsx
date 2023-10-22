import { useEffect, Suspense } from "react";
import { usePreferencesDispatch } from "../../context/users/context";
import { fetchUserPreferences } from "../../context/users/actions";
import { useSportsDispatch } from "../../context/sports/context";
import { fetchSports } from "../../context/sports/actions";
import { useTeamsDispatch } from "../../context/teams/context";
import { fetchTeams } from "../../context/teams/actions";
import { useNewsDispatch } from "../../context/news/context";
import { fetchNews } from "../../context/news/actions";
import NewsArticle from "./NewsArticle";
import { Outlet } from "react-router-dom";
import ErrorBoundary from "../../components/ErrorBoundary";

const News = () => {
  const dispatchSports = useSportsDispatch();
  const dispatchTeams = useTeamsDispatch();
  const disptachPreferences = usePreferencesDispatch();
  const disptachNews = useNewsDispatch();
  const isLoggedIn = !!localStorage.getItem("userData");
  useEffect(() => {
    fetchSports(dispatchSports);
    fetchTeams(dispatchTeams);
    fetchNews(disptachNews);
    if (isLoggedIn) {
      fetchUserPreferences(disptachPreferences);
    }
  }, [dispatchSports, dispatchTeams, disptachPreferences, disptachNews]);
  return (
    <>
      <div>
        <h2 className="text-xl font-bold m-2 ml-1 ">Trending News</h2>
        <ErrorBoundary>
          <Suspense
            fallback={<div className="suspense-loading">Loading...</div>}
          >
            <NewsArticle />
          </Suspense>
        </ErrorBoundary>
      </div>
      <Outlet />
    </>
  );
};

export default News;
