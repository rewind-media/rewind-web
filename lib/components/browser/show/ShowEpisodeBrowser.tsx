import React from "react";
import { ButtonLink } from "../../ButtonLink";
import { useParams } from "react-router";
import { Typography } from "@mui/material";
import { EpisodeLoader } from "../../loader/show/EpisodeLoader";
import { PropsWithSocket } from "../../../models";
import { ServerRoutes } from "@rewind-media/rewind-protocol";

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
              to={ServerRoutes.Web.Private.View.formatPlayerRoute(
                episode?.libraryName,
                episode.id
              )}
            >
              <img
                src={
                  episode.episodeImageId
                    ? ServerRoutes.Api.Image.formatImagePath(
                        episode.episodeImageId
                      )
                    : "" // TODO add default image
                }
                style={{ width: "100%" }}
                alt={episode.name}
              ></img>{" "}
              <Typography align={"center"}>{episode.name}</Typography>
            </ButtonLink>
          </>
        );
      }}
      socket={props.socket}
    />
  );
}
