import React from "react";
import MediaPlayer from "../components/player/MediaPlayer";
import { io, Socket } from "socket.io-client";
import ReactDOM from "react-dom/client";
import { Root } from "../components/Root";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { Settings } from "../components/settings/Settings";
import { NavBar } from "../components/NavBar";
import { UserSettings } from "../components/settings/UserSettings";
import { ClientSettings } from "../components/settings/ClientSettings";
import { AdminSettings } from "../components/settings/admin/AdminSettings";
import { UserAdminSettings } from "../components/settings/admin/UserAdminSettings";
import { Login } from "../components/Login";
import { Navigate } from "react-router";
import { Auth } from "../components/Auth";
import { Typography } from "@mui/material";
import { Home } from "../components/Home";
import { ShowLibraryBrowser } from "../components/browser/show/ShowLibraryBrowser";
import { ShowSeasonBrowser } from "../components/browser/show/ShowSeasonBrowser";
import { ShowSeriesBrowser } from "../components/browser/show/ShowSeriesBrowser";
import { ShowEpisodeBrowser } from "../components/browser/show/ShowEpisodeBrowser";
import { WebLog } from "../log";
import { SocketClient } from "../models";
import { ServerRoutes } from "@rewind-media/rewind-protocol";

export interface IndexProps {
  io: SocketClient;
}

const log = WebLog.getChildCategory("Index");

function Index(props: IndexProps) {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={ServerRoutes.root}
          element={
            <Root>
              <Outlet />
            </Root>
          }
        >
          <Route index element={<Navigate to={ServerRoutes.Web.root} />} />
          <Route path={ServerRoutes.Web.root}>
            <Route
              index
              element={<Navigate to={ServerRoutes.Web.Home.root} />}
            />
            <Route
              path={ServerRoutes.Web.Home.root}
              element={
                <Auth>
                  <Outlet />
                </Auth>
              }
            >
              <Route index element={<Home socket={socket} />} />
              <Route
                path={ServerRoutes.Web.Home.Browser.root}
                element={
                  <NavBar>
                    <Outlet />
                  </NavBar>
                }
              >
                <Route
                  index
                  element={<Navigate to={ServerRoutes.Web.Home.root} />}
                />
                <Route
                  path={ServerRoutes.Web.Home.Browser.Shows.library}
                  element={<ShowLibraryBrowser socket={socket} />}
                />
                <Route
                  path={ServerRoutes.Web.Home.Browser.Shows.show}
                  element={<ShowSeriesBrowser socket={socket} />}
                />
                <Route
                  path={ServerRoutes.Web.Home.Browser.Shows.season}
                  element={<ShowSeasonBrowser socket={socket} />}
                />
                <Route
                  path={ServerRoutes.Web.Home.Browser.Shows.episode}
                  element={<ShowEpisodeBrowser socket={socket} />}
                />
                <Route
                  path={ServerRoutes.Web.Home.Browser.Settings.root}
                  element={
                    <Settings>
                      <Outlet />
                    </Settings>
                  }
                >
                  {/* TODO implement settings index */}
                  <Route
                    index
                    element={
                      <Navigate
                        to={ServerRoutes.Web.Home.Browser.Settings.user}
                      />
                    }
                  />
                  <Route
                    path={ServerRoutes.Web.Home.Browser.Settings.user}
                    element={<UserSettings socket={socket} />}
                  />
                  <Route
                    path={ServerRoutes.Web.Home.Browser.Settings.client}
                    element={<ClientSettings />}
                  />
                  <Route
                    path={ServerRoutes.Web.Home.Browser.Settings.Admin.root}
                    element={<AdminSettings />}
                  >
                    <Route
                      path={ServerRoutes.Web.Home.Browser.Settings.Admin.users}
                      element={<UserAdminSettings socket={socket} />}
                    />
                  </Route>
                </Route>
              </Route>
              <Route
                path={ServerRoutes.Web.Home.player}
                element={<MediaPlayer socket={props.io} />}
              />

              <Route element={<Typography>Homepage</Typography>} />
            </Route>
            <Route
              path={ServerRoutes.Web.login}
              element={
                // TODO redirect home if already logged in
                <Login />
              }
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const socket: SocketClient = io();

const domRoot = document.getElementById("root") as HTMLElement;
const root = ReactDOM.createRoot(domRoot);

root.render(<Index io={socket} />);
