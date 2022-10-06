import React, { useState } from "react";

import { ButtonLink } from "../../ButtonLink";
import {ServerRoutes, ShowEpisodeInfo} from "@rewind-media/rewind-protocol";
import { useParams } from "react-router";
import { EpisodesLoader } from "../../loader/show/EpisodesLoader";
import {PropsWithSocket} from "../../../models";

export interface ShowSeasonBrowserProps extends PropsWithSocket {}

export function ShowSeasonBrowser(props: ShowSeasonBrowserProps) {
  const [episodes, setEpisodes] = useState<ShowEpisodeInfo[]>();
  const season = useParams().season;
  if (!season) return <></>;
  return (
    <EpisodesLoader
      seasonId={season}
      socket={props.socket}
      onLoad={(episodes) => {
        return (
          <>
            {episodes.map((episode) => {
              return (
                <ButtonLink
                  key={episode.id}
                  to={ServerRoutes.Web.Home.Browser.Shows.formatEpisodeRoute(
                    episode.id
                  )}
                >
                  {episode.name}
                </ButtonLink>
              );
            })}
          </>
        );
      }}
    />
  );
}
