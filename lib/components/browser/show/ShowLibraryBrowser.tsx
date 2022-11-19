import React, { useEffect, useState } from "react";
import { ButtonLink } from "../../ButtonLink";
import { ServerRoutes } from "@rewind-media/rewind-protocol";
import { useParams } from "react-router";
import { ShowsLoader } from "../../loader/show/ShowsLoader";
import { PropsWithSocket } from "../../../models";
import { Box, Grid, Typography } from "@mui/material";

export interface ShowLibraryBrowserProps extends PropsWithSocket {}

export function ShowLibraryBrowser(props: ShowLibraryBrowserProps) {
  const library = useParams().library;
  if (!library) return <></>;

  return (
    <ShowsLoader
      libraryId={library}
      onLoad={(shows) => (
        <Grid container direction={"row"} key={`SeriesContainer-${library}`}>
          {shows
            .sort((a, b) => a.showName.localeCompare(b.showName))
            .map((showEpisodeInfo) => {
              return (
                <Grid
                  item
                  key={`SeriesContainer-${showEpisodeInfo.id}`}
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  xl={2}
                >
                  <ButtonLink
                    key={showEpisodeInfo.id}
                    to={ServerRoutes.Web.Home.Browser.Shows.formatShowRoute(
                      showEpisodeInfo.id
                    )}
                    sx={{ width: "100%" }}
                  >
                    <Box sx={{ width: "100%" }}>
                      <img
                        src={
                          showEpisodeInfo.seriesImageId
                            ? ServerRoutes.Api.Image.formatImagePath(
                                showEpisodeInfo.seriesImageId
                              )
                            : "" // TODO add default image
                        }
                        style={{ width: "100%" }}
                        alt={showEpisodeInfo.showName}
                      ></img>{" "}
                      <Typography align={"center"}>
                        {showEpisodeInfo.showName}
                      </Typography>
                    </Box>
                  </ButtonLink>
                </Grid>
              );
            })}
        </Grid>
      )}
      socket={props.socket}
    />
  );
}
