import React from "react";
import { ButtonLink } from "../../ButtonLink";
import { useParams } from "react-router";
import { SeasonsLoader } from "../../loader/show/SeasonsLoader";
import { Box, Grid, Typography } from "@mui/material";
import { ServerRoutes } from "@rewind-media/rewind-protocol";
import { WebRoutes } from "../../../routes";
import { NavBar } from "../../NavBar";

export function ShowBrowser() {
  const show = useParams()["showId"];
  if (!show) return <></>;

  return (
    <NavBar>
      <SeasonsLoader
        showId={show}
        onLoad={(seasons) => {
          return (
            <Grid container direction={"row"} key={`SeasonsContainer-${show}`}>
              {seasons
                .sort((a, b) => a.seasonName.localeCompare(b.seasonName))
                .map((showSeasonInfo) => {
                  return (
                    <Grid
                      item
                      key={`SeasonContainer-${showSeasonInfo.id}`}
                      xs={12}
                      sm={6}
                      md={4}
                      lg={3}
                      xl={2}
                    >
                      <ButtonLink
                        key={showSeasonInfo.id}
                        to={WebRoutes.formatSeasonRoute(showSeasonInfo.id)}
                        sx={{ width: "100%" }}
                      >
                        <Box sx={{ width: "100%" }}>
                          <img
                            src={
                              showSeasonInfo.folderImageId
                                ? ServerRoutes.Api.Image.formatImagePath(
                                    showSeasonInfo.folderImageId
                                  )
                                : "" // TODO add default image
                            }
                            style={{ width: "100%" }}
                            alt={showSeasonInfo.seasonName}
                          ></img>{" "}
                          <Typography align={"center"}>
                            {showSeasonInfo.seasonName}
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
