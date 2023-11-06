import React, { useEffect, Suspense } from "react";
import { usePreferencesDispatch } from "../../context/users/context";
import { fetchUserPreferences } from "../../context/users/actions";
import { useSportsDispatch } from "../../context/sports/context";
import { fetchSports } from "../../context/sports/actions";
import { useTeamsDispatch } from "../../context/teams/context";
import { fetchTeams } from "../../context/teams/actions";
import { useNewsDispatch } from "../../context/news/context";
import { fetchNews } from "../../context/news/actions";
// import NewsArticle from "./NewsArticle";
const NewsArticle = React.lazy(() => import("./NewsArticle"));
// import Favourites from "./Favourites";
const Favourites = React.lazy(() => import("./Favourites"));
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
    <h2 className="text-xl font-bold m-2 mt-3">Trending News</h2>
    </div>
      
      <div className="flex h-screen w-full ">
        <div className="w-3/4" >
          <ErrorBoundary>
            <Suspense
              fallback={<div className="suspense-loading">Loading...</div>}
            >
              <NewsArticle />
            </Suspense>
          </ErrorBoundary>
        </div>
        <div className="w-1/4 ml-2 flex">
        <ErrorBoundary>
            <Suspense
              fallback={<div className="suspense-loading">Loading...</div>}
            >
              <Favourites />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default News;
