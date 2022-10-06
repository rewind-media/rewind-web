import React, { useEffect, useState } from "react";
import { ButtonLink } from "../../ButtonLink";
import {ServerRoutes} from "@rewind-media/rewind-protocol";
import { useParams } from "react-router";
import { SeriesLoader } from "../../loader/show/SeriesLoader";
import {PropsWithSocket} from "../../../models";

export interface ShowLibraryBrowserProps extends PropsWithSocket {}

export function ShowLibraryBrowser(props: ShowLibraryBrowserProps) {
  const library = useParams().library;
  if (!library) return <></>;

  return (
    <SeriesLoader
      libraryId={library}
      onLoad={(shows) => (
        <>
          {shows.map((showInfo) => {
            return (
              <ButtonLink
                key={showInfo.id}
                to={ServerRoutes.Web.Home.Browser.Shows.formatShowRoute(
                  showInfo.id
                )}
              >
                {showInfo.showName}
              </ButtonLink>
            );
          })}
        </>
      )}
      socket={props.socket}
    />
  );
}
