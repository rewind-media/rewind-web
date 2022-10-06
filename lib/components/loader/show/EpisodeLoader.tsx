import { Loading } from "../../Loading";
import React, { ReactElement, useEffect, useState } from "react";
import {PropsWithSocket} from "../../../models";
import { ShowEpisodeInfo } from "@rewind-media/rewind-protocol";

export interface EpisodeLoaderProps extends PropsWithSocket {
  episodeId: string;
  onLoad: (episodeInfo: ShowEpisodeInfo) => ReactElement;
  onError?: () => void;
}

export function EpisodeLoader(props: EpisodeLoaderProps) {
  const [episodeInfo, setEpisodeInfo] = useState<ShowEpisodeInfo>();

  useEffect(() => {
    props.socket.on("getShowEpisodeCallback", (res) => {
      setEpisodeInfo(res.episode);
    });
  });

  return (
    <Loading
      waitFor={episodeInfo}
      onWaitOnce={() => {
        props.socket.emit("getShowEpisode", {
          episode: props.episodeId,
        });
      }}
      render={(it) =>
        it ? props.onLoad(it) : (props.onError && props.onError()) || <></>
      }
    />
  );
}
