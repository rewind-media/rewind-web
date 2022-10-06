import {Library, LibraryType, ServerRoutes} from "@rewind-media/rewind-protocol";
import React, { useEffect, useState } from "react";
import { ButtonLink } from "./ButtonLink";
import {PropsWithSocket} from "../models";

interface HomeProps extends PropsWithSocket {
}

export function Home(props: HomeProps) {
  const [libraries, setLibraries] = useState<Library[]>([]);

  useEffect(() => {
    props.socket.on("listLibrariesCallback", (res) => {
      setLibraries(res.libraries);
    });
    props.socket.emit("listLibrariesRequest");
  }, []);

  const routes = libraries.map((lib) => {
    switch (lib.type) {
      case LibraryType.File:
        return ""; // TODO
      case LibraryType.Image:
        return ""; // TODO
      case LibraryType.Show:
        return ServerRoutes.Web.Home.Browser.Shows.formatLibraryRoot(lib.name);
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
