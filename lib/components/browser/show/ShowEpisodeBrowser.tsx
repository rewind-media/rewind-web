import React from "react";
import { ButtonLink } from "../../ButtonLink";
import { useParams } from "react-router";
import { Typography } from "@mui/material";
import { EpisodeLoader } from "../../loader/show/EpisodeLoader";
import {PropsWithSocket} from "../../../models";
import {ServerRoutes} from "@rewind-media/rewind-protocol";

export interface ShowSeasonEpisodeBrowserProps extends PropsWithSocket {}

export function ShowEpisodeBrowser(props: ShowSeasonEpisodeBrowserProps) {
  const episodeId = useParams().episode;
  if (!episodeId) return <></>;

  return (
    <EpisodeLoader
      episodeId={episodeId}
      onLoad={(episode) => {
        return (
          <>
            <Typography>{episode?.name}</Typography>
            <ButtonLink
              to={ServerRoutes.Web.Home.formatPlayerRoute(
                episode?.libraryName,
                episode.id
              )}
            >
              Play
            </ButtonLink>
          </>
        );
      }}
      socket={props.socket}
    />
  );
}
