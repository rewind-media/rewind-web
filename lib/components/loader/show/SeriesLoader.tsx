import { ButtonLink } from "../../ButtonLink";
import { SeriesInfo, ServerRoutes } from "@rewind-media/rewind-protocol";
import { Loading } from "../../Loading";
import React, { ReactElement, useEffect, useState } from "react";
import { PropsWithSocket } from "../../../models";

export interface ShowLibraryLoaderProps extends PropsWithSocket {
  libraryId: string;
  onLoad: (showInfo: SeriesInfo[]) => ReactElement;
  onError?: () => void;
}

export function SeriesLoader(props: ShowLibraryLoaderProps) {
  const [seriesInfo, setSeriesInfo] = useState<SeriesInfo[]>();

  useEffect(() => {
    props.socket.on("listSeriesCallback", (res) => {
      setSeriesInfo(res.shows);
    });
  });

  return (
    <Loading
      waitFor={seriesInfo}
      onWaitOnce={() => {
        props.socket.emit("listSeries", {
          libraryId: props.libraryId,
        });
      }}
      render={(it) => props.onLoad(it)}
    />
  );
}
