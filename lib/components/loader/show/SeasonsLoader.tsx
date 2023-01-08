import { Loading } from "../../Loading";
import React, { ReactElement, useEffect, useState } from "react";
import { HttpClient, SeasonInfo } from "@rewind-media/rewind-protocol";

export interface SeasonsLoaderProps {
  showId: string;
  onLoad: (showInfo: SeasonInfo[]) => ReactElement;
  onError?: () => void;
}

export function SeasonsLoader(props: SeasonsLoaderProps) {
  const [seasonInfos, setSeasonInfos] = useState<SeasonInfo[]>();

  useEffect(() => {
    HttpClient.listSeasons(props.showId).then((it) =>
      setSeasonInfos(it.seasons)
    );
  }, []);

  return <Loading waitFor={seasonInfos} render={(it) => props.onLoad(it)} />;
}
