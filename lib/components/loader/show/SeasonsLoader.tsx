import { Loading } from "../../Loading";
import React, { ReactElement, useEffect, useState } from "react";
import {PropsWithSocket} from "../../../models";
import { ShowSeasonInfo } from "@rewind-media/rewind-protocol";

export interface SeasonsLoaderProps extends PropsWithSocket {
  showId: string;
  onLoad: (showInfo: ShowSeasonInfo[]) => ReactElement;
  onError?: () => void;
}

export function SeasonsLoader(props: SeasonsLoaderProps) {
  const [seasonInfos, setSeasonInfos] = useState<ShowSeasonInfo[]>();

  useEffect(() => {
    props.socket.on("listShowSeasonsCallback", (res) => {
      setSeasonInfos(res.seasons);
    });
  });

  return (
    <Loading
      waitFor={seasonInfos}
      onWaitOnce={() => {
        props.socket.emit("listShowSeasons", {
          show: props.showId,
        });
      }}
      render={(it) => props.onLoad(it)}
    />
  );
}
