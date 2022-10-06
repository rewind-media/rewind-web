import React, { PropsWithChildren } from "react";
import { Box, Grid } from "@mui/material";
import { PlayerProgessText } from "./PlayerProgessText";
import screenfull from "screenfull";
import { Fullscreen, FullscreenExit } from "@mui/icons-material";

interface PlayerBottomBarProps {
  openControls: boolean;
  playing: boolean;
  pause: JSX.Element;
  play: JSX.Element;
  slider: JSX.Element;
  played: number;
  duration: number;
  startOffset: number;
}

function BarButton(props: PropsWithChildren) {
  return (
    <Grid
      item
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      xs="auto"
    >
      <Grid item xs="auto">
        {props.children}
      </Grid>
    </Grid>
  );
}

export function PlayerBottomBar(props: PlayerBottomBarProps) {
  return (
    <Box
      sx={{
        flexGrow: 1,
        marginLeft: "2vw",
        marginRight: "2vw",
        position: "fixed",
        bottom: 0,
        opacity: 0.8,
        backgroundColor: "#000000",
        width: "96vw",
        visibility: props.openControls ? "visible" : "hidden",
        zIndex: 1,
      }}
    >
      <Grid
        container
        spacing={3}
        wrap="nowrap"
        justifyContent="center"
        alignItems="center"
      >
        <BarButton>{props.playing ? props.pause : props.play}</BarButton>
        <Grid
          item
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          xs={true}
        >
          <Grid item sx={{ width: "100%" }}>
            {props.slider}
          </Grid>
        </Grid>
        <Grid>
          <BarButton>
            <PlayerProgessText
              played={props.played}
              startOffset={props.startOffset}
              duration={props.duration}
            />
          </BarButton>
        </Grid>
        <BarButton>
          {screenfull.isFullscreen ? (
            <FullscreenExit
              onClick={(e) => {
                screenfull.toggle();
                e.stopPropagation();
              }}
            />
          ) : (
            <Fullscreen
              onClick={(e) => {
                screenfull.toggle();
                e.stopPropagation();
              }}
            />
          )}
        </BarButton>
      </Grid>
    </Box>
  );
}
