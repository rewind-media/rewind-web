import { ShowInfo, HttpClient } from "@rewind-media/rewind-protocol";
import { Loading } from "../../Loading";
import React, { ReactElement, useEffect, useState } from "react";

export interface ShowLibraryLoaderProps {
  libraryId: string;
  onLoad: (showInfo: ShowInfo[]) => ReactElement;
  onError?: () => void;
}

export function ShowsLoader(props: ShowLibraryLoaderProps) {
  const [showInfos, setShowInfos] = useState<ShowInfo[]>();

  useEffect(() => {
    HttpClient.listShows(props.libraryId).then((it) => setShowInfos(it.shows));
  }, []);

  return <Loading waitFor={showInfos} render={(it) => props.onLoad(it)} />;
}
