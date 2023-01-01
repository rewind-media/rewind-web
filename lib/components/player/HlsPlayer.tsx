import React, { useRef, useState } from "react";
import ReactPlayer from "react-player/file";
import { Box } from "@mui/material";
import { Pause, PlayArrow } from "@mui/icons-material";
import "../../static/css/StreamPlayer.css";
import { ReactPlayerWrapper } from "./ReactPlayerWrapper";
import { PlayerSlider } from "./PlayerSlider";
import { PlayerBackButton } from "./PlayerBackButton";
import { PlayerBottomBar } from "./PlayerBottomBar";
import { WebLog } from "../../log";
import { HlsStreamProps } from "@rewind-media/rewind-protocol";
import { PropsWithSocket } from "../../models";
import { Duration } from "durr";

export interface HlsPlayerProps extends PropsWithSocket {
  readonly hlsStreamProps: HlsStreamProps;
  readonly onReloadStream?: (wanted: number) => void;
  readonly onUnmount?: () => void;
  readonly onEnded?: () => void;
}

const log = WebLog.getChildCategory("StreamPlayer");

export const HlsPlayer = (props: HlsPlayerProps) => {
  const [desiredReloadTimestamp, setDesiredReloadTimestamp] =
    useState<number>();
  const [buffered, setBuffered] = useState(0);
  const [played, setPlayed] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [controlsVisibleLast, setControlsVisibleLast] = useState(0);
  const playerRef = useRef<ReactPlayer>(null);

  const setControlsVisible = () => setControlsVisibleLast(Date.now());

  const openControls =
    controlsVisibleLast >= Duration.seconds(3).before().getTime();

  React.useEffect(() => {
    return props.onUnmount;
  }, []);

  React.useEffect(() => {
    if (props.onReloadStream && desiredReloadTimestamp) {
      props.onReloadStream(desiredReloadTimestamp);
    }
  }, [desiredReloadTimestamp]);

  const player = (
    <ReactPlayerWrapper
      playerRef={playerRef}
      hlsStreamProps={props.hlsStreamProps}
      playing={playing}
      openControls={openControls}
      onPlayed={setPlayed}
      onBuffered={setBuffered}
      onReloadStream={() => {
        log.info(`Reloading Stream: Played: ${played}, Buffered: ${buffered}`);
        if (played >= buffered - 1)
          // If we're within a second of the end of the buffer...
          setDesiredReloadTimestamp(props.hlsStreamProps.startOffset + played);
      }}
      onEnded={props.onEnded}
    ></ReactPlayerWrapper>
  );

  const slider = PlayerSlider({
    played: played,
    startOffset: props.hlsStreamProps.startOffset,
    duration: props.hlsStreamProps.duration,
    buffered: buffered,
    playerRef: playerRef,
    setPlayed: setPlayed,
    setBuffered: setBuffered,
    setDesiredReloadTimestamp: setDesiredReloadTimestamp,
  });

  const play = <PlayArrow onClick={() => setPlaying(true)} />;
  const pause = <Pause onClick={() => setPlaying(false)} />;

  return (
    <Box
      onKeyUpCapture={(event) => {
        if (event.code === "Space") setPlaying(!playing);
      }}
      onPointerMove={setControlsVisible}
      onTouchMove={setControlsVisible}
      onClick={() => {
        if (openControls) {
          setPlaying(!playing);
        } else {
          setControlsVisible();
        }
      }}
    >
      <div style={{ width: "fit-content", height: "fit-content" }}>
        {player}
      </div>
      <PlayerBackButton
        openControls={openControls}
        socket={props.socket}
        streamId={props.hlsStreamProps.id}
      />
      {PlayerBottomBar({
        openControls: openControls,
        playing: playing,
        pause: pause,
        play: play,
        slider: slider,
        played: played,
        startOffset: props.hlsStreamProps.startOffset,
        duration: props.hlsStreamProps.duration,
      })}
    </Box>
  );
};
