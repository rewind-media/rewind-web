import { Loading } from "../../Loading";
import React, { ReactElement, useEffect, useState } from "react";
import { PropsWithSocket } from "../../../models";
import { ShowEpisodeInfo } from "@rewind-media/rewind-protocol";

export interface EpisodesLoaderProps extends PropsWithSocket {
  seasonId: string;
  onLoad: (episodeInfos: ShowEpisodeInfo[]) => ReactElement;
  onError?: () => void;
}

export function EpisodesLoader(props: EpisodesLoaderProps) {
  const [episodeInfos, setEpisodeInfos] = useState<ShowEpisodeInfo[]>();

  useEffect(() => {
    props.socket.on("listShowEpisodesCallback", (res) => {
      setEpisodeInfos(res.episodes);
    });
  });

  return (
    <Loading
      waitFor={episodeInfos}
      onWaitOnce={() => {
        props.socket.emit("listShowEpisodes", {
          season: props.seasonId,
        });
      }}
      render={(it) => props.onLoad(it)}
    />
  );
}
