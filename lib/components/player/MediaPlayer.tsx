import { withSize } from "react-sizeme";
import { HlsPlayer } from "./HlsPlayer";
import React, { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router";
import { Loading } from "../Loading";
import { Box } from "@mui/material";
import { WebLog } from "../../log";
import { PropsWithSocket } from "../../models";
import {
  HlsStreamProps,
  ServerRoutes,
  EpisodeInfo,
  SeasonInfo,
  HttpClient,
} from "@rewind-media/rewind-protocol";
import formatPlayerRoute = ServerRoutes.Web.Home.formatPlayerRoute;
import naturalCompare from "string-natural-compare";

interface MediaPlayerProps extends PropsWithSocket {
  readonly onBackButton?: () => void;
  readonly backButtonPath?: string;
}

const log = WebLog.getChildCategory("MediaPlayer");

function MediaPlayer(props: MediaPlayerProps) {
  const { id, library } = useParams();
  React.useEffect(() => {}, [window.location]);

  const [clientStreamProps, setClientStreamProps] = useState<HlsStreamProps>();
  const nav = useNavigate();
  const goToNextEpisode = (libName: string, episodeId: string) => {
    if (libName !== library || id !== episodeId) {
      setClientStreamProps(undefined);
      nav(formatPlayerRoute(libName, episodeId), { replace: true });
    }
  };

  React.useEffect(() => {
    props.socket.on("createStreamCallback", (e) => {
      setClientStreamProps(e.streamProps);
    });
  });

  React.useEffect(() => {
    return () => {
      props.socket.emit("cancelStream");
    };
  }, []);
  log.info(`Playing media ${id} from ${library}`);

  return id ? (
    library ? (
      <Box sx={{ height: "100vh" }} key={window.location.pathname}>
        <Loading
          waitFor={clientStreamProps}
          render={(t) => (
            <HlsPlayer
              {...props}
              hlsStreamProps={t}
              onReloadStream={(wanted) => {
                props.socket.emit("createStream", {
                  library: library,
                  mediaId: t.mediaInfo.id,
                  startOffset: wanted,
                });
                setClientStreamProps(undefined);
              }}
              onUnmount={() => {
                // On Unmount
                // props.socket.emit("cancelStream");
              }}
              // TODO pull this ugly mess out
              onEnded={async () => {
                const fail = () => {
                  nav(ServerRoutes.Web.Home.Browser.root);
                };
                const currEpisode = (
                  await HttpClient.getEpisode(t.mediaInfo.id)
                ).episode;
                const currSeasonEpisodes = (
                  await HttpClient.listEpisodes(currEpisode.seasonId)
                ).episodes.sort(episodeComparator);
                const curEpIndex = currSeasonEpisodes.findIndex(
                  (it) => it.id == currEpisode.id
                );
                const nextEpisode =
                  curEpIndex !== -1
                    ? currSeasonEpisodes[curEpIndex + 1]
                    : undefined;

                if (nextEpisode) {
                  log.info(`Found next episode ${JSON.stringify(nextEpisode)}`);
                  goToNextEpisode(t.mediaInfo.libraryName, nextEpisode.id);
                } else {
                  const seasons = (
                    await HttpClient.listSeasons(currEpisode.showId)
                  ).seasons.sort(seasonComparator);
                  const currSeasonIndex = seasons.findIndex(
                    (value) => value.id == currEpisode.seasonId
                  );
                  const nextSeason =
                    currSeasonIndex !== -1
                      ? seasons[currSeasonIndex + 1]
                      : undefined;
                  const nextSeasonFirstEpisode = nextSeason
                    ? (await HttpClient.listEpisodes(nextSeason.id)).episodes
                        .sort(episodeComparator)
                        .at(0)
                    : undefined;

                  if (nextSeasonFirstEpisode) {
                    goToNextEpisode(
                      t.mediaInfo.libraryName,
                      nextSeasonFirstEpisode.id
                    );
                  } else {
                    fail();
                  }
                }
              }}
            />
          )}
          onWaitOnce={() => {
            props.socket.emit("createStream", {
              library: library,
              mediaId: id,
              startOffset: 0,
            });
          }}
        />
      </Box>
    ) : (
      <Navigate to={props.backButtonPath ?? ServerRoutes.root} />
    )
  ) : (
    <Navigate to={props.backButtonPath ?? ServerRoutes.root} />
  );
}

const episodeComparator = (a: EpisodeInfo, b: EpisodeInfo) => {
  return (a.details?.episode ?? 0) - (b.details?.episode ?? 0);

  // if (b.details?.episode && a.details?.episode) {
  // return a.details.episode - b.details.episode;
  // } else {
  //   return naturalCompare(a.name, b.name);
  // }
};
const seasonComparator = (a: SeasonInfo, b: SeasonInfo) => {
  return (a.details?.seasonnumber ?? 0) - (b.details?.seasonnumber ?? 0);

  // if (b.details?.seasonnumber && a.details?.seasonnumber) {
  // return a.details.seasonnumber - b.details.seasonnumber;
  // } else {
  //   return naturalCompare(a.seasonName, b.seasonName);
  // }
};

export default withSize({ monitorHeight: true })(MediaPlayer);
