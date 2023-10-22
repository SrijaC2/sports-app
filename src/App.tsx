import { ThemeContext } from "./context/theme";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { useContext } from "react";
import { SportsProvider } from "./context/sports/context";
import { TeamsProvider } from "./context/teams/context";
import { MatchesProvider } from "./context/matches/context";
import { PreferencesProvider } from "./context/users/context";
import { NewsProvider } from "./context/news/context";
const App = () => {
  const { theme } = useContext(ThemeContext);
  return (
    <div className={` w-full mx-auto  ${theme === "dark" ? "dark" : ""}`}>
      <NewsProvider>
        <PreferencesProvider>
          <MatchesProvider>
            <TeamsProvider>
              <SportsProvider>
                <RouterProvider router={router} />
              </SportsProvider>
            </TeamsProvider>
          </MatchesProvider>
        </PreferencesProvider>
      </NewsProvider>
    </div>
  );
};
export default App;
