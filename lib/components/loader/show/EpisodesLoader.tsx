import { Loading } from "../../Loading";
import React, { ReactElement, useEffect, useState } from "react";
import { EpisodeInfo, HttpClient } from "@rewind-media/rewind-protocol";

export interface EpisodesLoaderProps {
  seasonId: string;
  onLoad: (episodeInfos: EpisodeInfo[]) => ReactElement;
  onError?: () => void;
}

export function EpisodesLoader(props: EpisodesLoaderProps) {
  const [episodeInfos, setEpisodeInfos] = useState<EpisodeInfo[]>();

  useEffect(() => {
    HttpClient.listEpisodes(props.seasonId).then((it) =>
      setEpisodeInfos(it.episodes)
    );
  }, []);

  return <Loading waitFor={episodeInfos} render={(it) => props.onLoad(it)} />;
}
