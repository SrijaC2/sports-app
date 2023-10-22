/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useContext, Fragment, useEffect } from "react";
import { Disclosure, Menu, Transition, Switch } from "@headlessui/react";
import { UserIcon } from "@heroicons/react/24/solid";
import Logo from "../../assets/images/logo.png";
import { ThemeContext } from "../../context/theme";
import Preferences from "../../pages/preferences";

const classNames = (...classes: string[]): string =>
  classes.filter(Boolean).join(" ");

const Appbar = () => {
  const { theme, setTheme } = useContext(ThemeContext);

  const [enabled, setEnabled] = useState(theme === "dark");
  const [userNavigation, setUserNavigation] = useState([
    { name: "Sign in", href: "/signin" },
    { name: "Sign up", href: "/signup" },
  ]);
  const authenticated = !!localStorage.getItem("authToken");

  useEffect(() => {
    if (authenticated) {
      setUserNavigation([{ name: "Sign out", href: "/logout" }]);
    } else {
      setUserNavigation([
        { name: "Sign in", href: "/signin" },
        { name: "Sign up", href: "/signup" },
      ]);
    }
  }, [authenticated]);

  const toggleTheme = () => {
    let newTheme = "";
    if (theme === "light") {
      newTheme = "dark";
    } else {
      newTheme = "light";
    }
    setEnabled(!enabled);
    setTheme(newTheme);
  };

  return (
    <>
      <Disclosure as="nav" className="border-b border-slate-200">
        {() => (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <img className="h-12 rounded" src={Logo} alt="SportSpec" />
                </div>
              </div>

              <div className="hidden md:block">
                <div className="ml-4 flex items-center md:ml-6">
                  <Switch
                    checked={enabled}
                    onChange={toggleTheme}
                    className={`${enabled ? "bg-slate-400" : "bg-slate-700"}
          relative inline-flex h-[24px] w-[60px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                  >
                    <span
                      aria-hidden="true"
                      className={`${enabled ? "translate-x-9" : "translate-x-0"}
                pointer-events-none inline-block h-[16px] w-[16px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                    />
                  </Switch>

                  {authenticated && <Preferences />}

                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="rounded-full bg-white p-1 text-gray-400 hover:text-blue-600">
                        <UserIcon className="h-6 w-6" aria-hidden="true" />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {userNavigation.map((item) => (
                          <Menu.Item key={item.name}>
                            {({ active }) => (
                              <a
                                href={item.href}
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700"
                                )}
                              >
                                {item.name}
                              </a>
                            )}
                          </Menu.Item>
                        ))}
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
            </div>
          </div>
        )}
      </Disclosure>
    </>
  );
};

export default Appbar;
