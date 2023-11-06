import { createBrowserRouter } from "react-router-dom";
import AccountLayout from "../layouts/account";
import Signin from "../pages/signin";
import Signup from "../pages/signup";
import Logout from "../pages/logout";
import Notfound from "../pages/Notfound";
import LiveGames from "../pages/matches";
import News from "../pages/news";
import SingleArticle from "../pages/news/SingleArticle";
import ChangePwd from "../pages/changePwd"

const router = createBrowserRouter([
  {
    path: "/",
    element: <AccountLayout />,
    children: [
      {
        path: "",
        element: <LiveGames />,
        children: [
          {
            path: "",
            element: <News />,
            children: [
              {
                path: "/articles/:articleID",
                element: <SingleArticle />,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "/notfound",
    element: <Notfound />,
  },
  {
    path: "*",
    element: <Notfound />,
  },
  {
    path: "/signin",
    element: <Signin />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/changePwd",
    element: <ChangePwd />,
  },
  {
    path: "/logout",
    element: <Logout />,
  },
]);

export default router;
