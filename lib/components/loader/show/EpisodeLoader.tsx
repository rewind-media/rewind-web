import { Loading } from "../../Loading";
import React, { ReactElement, useEffect, useState } from "react";
import { PropsWithSocket } from "../../../models";
import { EpisodeInfo, HttpClient } from "@rewind-media/rewind-protocol";

export interface EpisodeLoaderProps extends PropsWithSocket {
  episodeId: string;
  onLoad: (episodeInfo: EpisodeInfo) => ReactElement;
  onError?: () => void;
}

export function EpisodeLoader(props: EpisodeLoaderProps) {
  const [episodeInfo, setEpisodeInfo] = useState<EpisodeInfo>();

  useEffect(() => {
    HttpClient.getEpisode(props.episodeId).then((it) =>
      setEpisodeInfo(it.episode)
    );
  }, []);

  return (
    <Loading
      waitFor={episodeInfo}
      render={(it) =>
        it ? props.onLoad(it) : (props.onError && props.onError()) || <></>
      }
    />
  );
}
