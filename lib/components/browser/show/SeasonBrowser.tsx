import React from "react";

import { ButtonLink } from "../../ButtonLink";
import { useParams } from "react-router";
import { EpisodesLoader } from "../../loader/show/EpisodesLoader";
import { Box, Grid, Typography } from "@mui/material";
import { WebRoutes } from "../../../routes";
import { ServerRoutes } from "@rewind-media/rewind-protocol";
import { NavBar } from "../../NavBar";

export function SeasonBrowser() {
  const season = useParams()["seasonId"];
  if (!season) return <></>;
  return (
    <NavBar>
      <EpisodesLoader
        seasonId={season}
        onLoad={(episodes) => {
          return (
            <Grid
              container
              direction={"row"}
              key={`EpisodesContainer-${season}`}
            >
              {episodes
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((showEpisodeInfo) => {
                  return (
                    <Grid
                      item
                      key={`EpisodesContainer-${showEpisodeInfo.id}`}
                      xs={12}
                      sm={6}
                      md={4}
                      lg={3}
                      xl={2}
                    >
                      <ButtonLink
                        key={showEpisodeInfo.id}
                        to={WebRoutes.formatEpisodeRoute(showEpisodeInfo.id)}
                        sx={{ width: "100%" }}
                      >
                        <Box sx={{ width: "100%" }}>
                          <img
                            src={
                              showEpisodeInfo.episodeImageId
                                ? ServerRoutes.Api.Image.formatImagePath(
                                    showEpisodeInfo.episodeImageId
                                  )
                                : "" // TODO add default image
                            }
                            style={{ width: "100%" }}
                            alt={showEpisodeInfo.name}
                          ></img>{" "}
                          <Typography align={"center"}>
                            {showEpisodeInfo.name}
                          </Typography>
                        </Box>
                      </ButtonLink>
                    </Grid>
                  );
                })}
            </Grid>
          );
        }}
      />
    </NavBar>
  );
}
