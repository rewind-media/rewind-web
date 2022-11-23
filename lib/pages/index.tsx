import React from "react";
import MediaPlayer from "../components/player/MediaPlayer";
import { io } from "socket.io-client";
import ReactDOM from "react-dom/client";
import { Root } from "../components/Root";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { Settings } from "../components/settings/Settings";
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
            <Route index element={<Home />} />
            <Route
              path={WebRoutes.library}
              element={<ShowLibraryBrowser socket={socket} />}
            />
            <Route
              path={WebRoutes.show}
              element={<ShowBrowser socket={socket} />}
            />
            <Route
              path={WebRoutes.season}
              element={<SeasonBrowser socket={socket} />}
            />
            <Route
              path={WebRoutes.episode}
              element={<EpisodeBrowser socket={socket} />}
            />

            <Route
              path={WebRoutes.Settings.root}
              element={
                <Settings>
                  <Outlet />
                </Settings>
              }
            >
              {/* TODO implement settings index */}
              <Route
                index
                element={<Navigate to={WebRoutes.Settings.user} />}
              />
              <Route
                path={WebRoutes.Settings.user}
                element={<UserSettings socket={socket} />}
              />
              <Route
                path={WebRoutes.Settings.client}
                element={<ClientSettings />}
              />
              <Route
                path={WebRoutes.Settings.Admin.root}
                element={<AdminSettings />}
              >
                <Route
                  path={WebRoutes.Settings.Admin.users}
                  element={<UserAdminSettings socket={socket} />}
                />
              </Route>
            </Route>
          </Route>
          <Route
            path={WebRoutes.player}
            element={<MediaPlayer socket={props.io} />}
          />
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
