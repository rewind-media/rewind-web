import { HttpClient, Library } from "@rewind-media/rewind-protocol";
import React, { useEffect, useState } from "react";
import { ButtonLink } from "./ButtonLink";
import { WebRoutes } from "../routes";
import { NavBar } from "./NavBar";

export function Home() {
  const [libraries, setLibraries] = useState<Library[]>([]);

  useEffect(() => {
    HttpClient.listLibraries().then((it) => setLibraries(it.libraries));
  }, []);

  const libEntries = libraries.map((lib) => {
    return { route: WebRoutes.formatLibraryRoute(lib.name), name: lib.name };
  });

  return (
    <NavBar>
      {libEntries.map((libEntry) => {
        return (
          <ButtonLink key={libEntry.route} to={libEntry.route}>
            {libEntry.name}
          </ButtonLink>
        );
      })}
    </NavBar>
  );
}
