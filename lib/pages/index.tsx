import React from "react";
import MediaPlayer from "../components/player/MediaPlayer";
import { io } from "socket.io-client";
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
          path={ServerRoutes.Web.root}
          element={
            <Root>
              <Outlet />
            </Root>
          }
        >
          <Route
            index={true}
            element={<Navigate to={ServerRoutes.Web.Private.Browse.home} />}
          />
          <Route path={ServerRoutes.Web.Auth.login} element={<Login />} />
          <Route
            path={ServerRoutes.Web.Private.root}
            element={
              <Auth>
                <Outlet />
              </Auth>
            }
          >
            <Route
              path={ServerRoutes.Web.Private.Browse.root}
              element={
                <NavBar>
                  <Outlet />
                </NavBar>
              }
            >
              <Route
                path={ServerRoutes.Web.Private.Browse.home}
                element={<Home />}
              />
              <Route
                path={ServerRoutes.Web.Private.Browse.Library.show}
                element={<ShowLibraryBrowser socket={socket} />}
              />
              <Route
                path={ServerRoutes.Web.Private.Browse.show}
                element={<ShowSeriesBrowser socket={socket} />}
              />
              <Route
                path={ServerRoutes.Web.Private.Browse.season}
                element={<ShowSeasonBrowser socket={socket} />}
              />
              <Route
                path={ServerRoutes.Web.Private.Browse.episode}
                element={<ShowEpisodeBrowser socket={socket} />}
              />

              <Route
                path={ServerRoutes.Web.Private.Browse.Settings.root}
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
                      to={ServerRoutes.Web.Private.Browse.Settings.user}
                    />
                  }
                />
                <Route
                  path={ServerRoutes.Web.Private.Browse.Settings.user}
                  element={<UserSettings socket={socket} />}
                />
                <Route
                  path={ServerRoutes.Web.Private.Browse.Settings.client}
                  element={<ClientSettings />}
                />
                <Route
                  path={ServerRoutes.Web.Private.Browse.Settings.Admin.root}
                  element={<AdminSettings />}
                >
                  <Route
                    path={ServerRoutes.Web.Private.Browse.Settings.Admin.users}
                    element={<UserAdminSettings socket={socket} />}
                  />
                </Route>
              </Route>
            </Route>
            <Route
              path={ServerRoutes.Web.Private.View.show}
              element={<MediaPlayer socket={props.io} />}
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
