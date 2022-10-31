import React from "react";
import ReactPlayer from "react-player";
import { WebLog } from "../../log";
import { HlsStreamProps } from "@rewind-media/rewind-protocol";

const log = WebLog.getChildCategory("Pla");

export interface PlayerWrapperProps {
  playerRef: React.RefObject<ReactPlayer>;
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
        file: {
          attributes: {
            loop: false,
          },
          hlsOptions: {
            backBufferLength: Infinity,
            maxBufferHole: 0.5,
          },
        },
      }}
      onError={(e, data) => {
        log.error(
          e,
          `Monitor ${
            props.hlsStreamProps.id
          } encountered error: ${JSON.stringify(data)}`
        );

        props.onReloadStream();

        // if (
        //   e.toString() !==
        //   "NotAllowedError: The play method is not allowed by the user agent or the platform in the current context, possibly because the user denied permission."
        // ) {
        //   setTimeout(() => {
        //     log.info(
        //       `Retried loading ${props.clientStreamProps.id} ${retry} times.`
        //     );
        //     setRetry(retry + 1);
        //   }, 1000);
        // }
      }}
      onProgress={(state) => {
        props.onPlayed(state.playedSeconds);
        props.onBuffered(state.loadedSeconds);
      }}
      onEnded={() => (props.onEnded ? props.onEnded() : undefined)}
    />
  );
}
