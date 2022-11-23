import React from "react";
import { ButtonLink } from "../../ButtonLink";
import { useParams } from "react-router";
import { Typography } from "@mui/material";
import { EpisodeLoader } from "../../loader/show/EpisodeLoader";
import { PropsWithSocket } from "../../../models";
import { ServerRoutes } from "@rewind-media/rewind-protocol";
import { WebRoutes } from "../../../routes";
import { NavBar } from "../../NavBar";

export interface ShowSeasonEpisodeBrowserProps extends PropsWithSocket {}

export function EpisodeBrowser(props: ShowSeasonEpisodeBrowserProps) {
  const episodeId = useParams().episodeId;
  if (!episodeId) return <></>;

  return (
    <NavBar>
      <EpisodeLoader
        episodeId={episodeId}
        onLoad={(episode) => {
          return (
            <>
              <Typography>{episode?.name}</Typography>
              <ButtonLink
                to={WebRoutes.formatPlayerRoute(
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
    </NavBar>
  );
}
