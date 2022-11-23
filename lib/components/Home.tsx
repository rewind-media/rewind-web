import {
  HttpClient,
  Library,
  LibraryType,
} from "@rewind-media/rewind-protocol";
import React, { useEffect, useState } from "react";
import { ButtonLink } from "./ButtonLink";
import { WebRoutes } from "../routes";
import { NavBar } from "./NavBar";

export function Home() {
  const [libraries, setLibraries] = useState<Library[]>([]);

  useEffect(() => {
    HttpClient.listLibraries().then((it) => setLibraries(it.libraries));
  }, []);

  const routes = libraries.map((lib) => WebRoutes.formatLibraryRoute(lib.name));

  return (
    <NavBar>
      {routes.map((route, index) => {
        return (
          <ButtonLink key={route} to={route}>
            {libraries[index].name}
          </ButtonLink>
        );
      })}
    </NavBar>
  );
}
