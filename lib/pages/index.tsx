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
import { SeasonBrowser } from "../components/browser/show/SeasonBrowser";
import { ShowBrowser } from "../components/browser/show/ShowBrowser";
import { EpisodeBrowser } from "../components/browser/show/EpisodeBrowser";
import { WebLog } from "../log";
import { SocketClient } from "../models";
import { WebRoutes } from "../routes";

export interface IndexProps {
  io: SocketClient;
}

const log = WebLog.getChildCategory("Index");

function Index(props: IndexProps) {
  return (
    <Root>
      <BrowserRouter>
        <Routes>
          <Route
            path={WebRoutes.root}
            element={
              <Auth>
                <Outlet />
              </Auth>
            }
          >
            <Route
              index
              element={
                <NavBar>
                  <Home />
                </NavBar>
              }
            />
            <Route
              path={WebRoutes.Browse.root}
              element={
                <NavBar>
                  <Outlet />
                </NavBar>
              }
            >
              <Route path={WebRoutes.Browse.home} element={<Home />} />
              <Route
                path={WebRoutes.Browse.Library.show}
                element={<ShowLibraryBrowser socket={socket} />}
              />
              <Route
                path={WebRoutes.Browse.show}
                element={<ShowBrowser socket={socket} />}
              />
              <Route
                path={WebRoutes.Browse.season}
                element={<SeasonBrowser socket={socket} />}
              />
              <Route
                path={WebRoutes.Browse.episode}
                element={<EpisodeBrowser socket={socket} />}
              />

              <Route
                path={WebRoutes.Browse.Settings.root}
                element={
                  <Settings>
                    <Outlet />
                  </Settings>
                }
              >
                {/* TODO implement settings index */}
                <Route
                  index
                  element={<Navigate to={WebRoutes.Browse.Settings.user} />}
                />
                <Route
                  path={WebRoutes.Browse.Settings.user}
                  element={<UserSettings socket={socket} />}
                />
                <Route
                  path={WebRoutes.Browse.Settings.client}
                  element={<ClientSettings />}
                />
                <Route
                  path={WebRoutes.Browse.Settings.Admin.root}
                  element={<AdminSettings />}
                >
                  <Route
                    path={WebRoutes.Browse.Settings.Admin.users}
                    element={<UserAdminSettings socket={socket} />}
                  />
                </Route>
              </Route>
            </Route>
            <Route
              path={WebRoutes.View.show}
              element={<MediaPlayer socket={props.io} />}
            />
          </Route>
          <Route path={WebRoutes.Auth.login} element={<Login />} />
        </Routes>
      </BrowserRouter>
    </Root>
  );
}

const socket: SocketClient = io();

const domRoot = document.getElementById("root") as HTMLElement;
const root = ReactDOM.createRoot(domRoot);

root.render(<Index io={socket} />);
