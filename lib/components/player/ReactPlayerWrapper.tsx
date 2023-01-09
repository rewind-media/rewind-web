import React from "react";
import ReactPlayer from "react-player/file";
import { WebLog } from "../../log";
import { HlsStreamProps } from "@rewind-media/rewind-protocol";
import FilePlayer from "react-player/file";
import { default as Hls } from "hls.js";

const log = WebLog.getChildCategory("ReactPlayerWrapper");

export interface PlayerWrapperProps {
  playerRef: React.RefObject<FilePlayer>;
  hlsStreamProps: HlsStreamProps;
  playing: boolean;
  openControls: boolean;
  onPlayed: (played: number) => void;
  onBuffered: (buffered: number) => void;
  onReloadStream: () => void;
  onEnded?: () => void;
}

export function ReactPlayerWrapper(props: PlayerWrapperProps) {
  return (
    <ReactPlayer
      ref={props.playerRef}
      url={props.hlsStreamProps.url}
      controls={false}
      playing={props.playing}
      width={"100vw"}
      height={"100vh"}
      loop={false}
      style={{
        margin: "0px",
        cursor: props.openControls ? "default" : "none",
        zIndex: 0,
        overflow: "hidden",
      }}
      config={{
        attributes: {
          loop: false,
        },
        hlsOptions: {
          subtitleDisplay: true,
        },
      }}
      onError={(e, data, hlsInstance: Hls) => {
        log.error(
          e,
          `Monitor ${
            props.hlsStreamProps.id
          } encountered error: ${JSON.stringify(data)}`
        );
        if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
          hlsInstance.recoverMediaError();
        }
      }}
      onProgress={(state) => {
        props.onPlayed(state.playedSeconds);
        props.onBuffered(state.loadedSeconds);
      }}
      onEnded={() => (props.onEnded ? props.onEnded() : undefined)}
    />
  );
}
