import {
  HttpClient,
  Library,
  LibraryType,
} from "@rewind-media/rewind-protocol";
import React, { useEffect, useState } from "react";
import { ButtonLink } from "./ButtonLink";
import { WebRoutes } from "../routes";

export function Home() {
  const [libraries, setLibraries] = useState<Library[]>([]);

  useEffect(() => {
    HttpClient.listLibraries().then((it) => setLibraries(it.libraries));
  }, []);

  const routes = libraries.map((lib) => {
    switch (lib.type) {
      case LibraryType.File:
        return ""; // TODO
      case LibraryType.Image:
        return ""; // TODO
      case LibraryType.Show:
        return WebRoutes.Browse.Library.formatShowRoute(lib.name);
    }
  });

  return (
    <>
      {routes.map((route, index) => {
        return (
          <ButtonLink key={route} to={route}>
            {libraries[index].name}
          </ButtonLink>
        );
      })}
    </>
  );
}
