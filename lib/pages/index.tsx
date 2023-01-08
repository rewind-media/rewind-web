import React from "react";
import MediaPlayer from "../components/player/MediaPlayer";
import ReactDOM from "react-dom/client";
import { Root } from "../components/Root";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Outlet,
  Route,
  RouterProvider,
} from "react-router-dom";
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
import { WebRoutes } from "../routes";
import { LibraryAdminSettings } from "../components/settings/admin/LibraryAdminSettings";

function Index() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route
          path={WebRoutes.root}
          element={
            <Auth>
              <Outlet />
            </Auth>
          }
        >
          <Route index element={<Home />} />
          <Route path={WebRoutes.library} element={<ShowLibraryBrowser />} />
          <Route path={WebRoutes.show} element={<ShowBrowser />} />
          <Route path={WebRoutes.season} element={<SeasonBrowser />} />
          <Route path={WebRoutes.episode} element={<EpisodeBrowser />} />

          <Route
            path={WebRoutes.Settings.root}
            element={
              <Settings>
                <Outlet />
              </Settings>
            }
          >
            {/* TODO implement settings index */}
            <Route index element={<Navigate to={WebRoutes.Settings.user} />} />
            <Route path={WebRoutes.Settings.user} element={<UserSettings />} />
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
                element={<UserAdminSettings />}
              />{" "}
              <Route
                path={WebRoutes.Settings.Admin.libraries}
                element={<LibraryAdminSettings />}
              />
            </Route>
          </Route>
        </Route>
        <Route path={WebRoutes.player} element={<MediaPlayer />} />
        <Route path={WebRoutes.Auth.login} element={<Login />} />
      </>
    )
  );
  return (
    <Root>
      <RouterProvider router={router} />
    </Root>
  );
}

const domRoot = document.getElementById("root") as HTMLElement;
const root = ReactDOM.createRoot(domRoot);

root.render(<Index />);
