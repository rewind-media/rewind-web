import { withSize } from "react-sizeme";
import { HlsPlayer } from "./HlsPlayer";
import React, { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router";
import { Loading } from "../Loading";
import { Box, CircularProgress } from "@mui/material";
import { WebLog } from "../../log";
import { PropsWithSocket } from "../../models";
import {
  HlsStreamProps,
  ServerRoutes,
  EpisodeInfo,
  SeasonInfo,
  HttpClient,
  CreateEpisodeHlsStreamRequest,
} from "@rewind-media/rewind-protocol";
import { WebRoutes } from "../../routes";

interface MediaPlayerProps extends PropsWithSocket {
  readonly onBackButton?: () => void;
  readonly backButtonPath?: string;
}

const log = WebLog.getChildCategory("MediaPlayer");

function MediaPlayer(props: MediaPlayerProps) {
  const { mediaId, libraryId } = useParams();
  const [episode, setEpisode] = useState<EpisodeInfo>();
  React.useEffect(() => {}, [window.location]);
  const [clientStreamProps, setClientStreamProps] = useState<HlsStreamProps>();
  const nav = useNavigate();
  const goToNextEpisode = (libName: string, episodeId: string) => {
    if (libName !== libraryId || mediaId !== episodeId) {
      setClientStreamProps(undefined);
      nav(WebRoutes.formatPlayerRoute(libName, episodeId), {
        replace: true,
      });
    }
  };

  const goBack = () => nav(props.backButtonPath ?? ServerRoutes.root);
  if (!mediaId || !libraryId) {
    return <Navigate to={props.backButtonPath ?? ServerRoutes.root} />;
  }

  React.useEffect(() => {
    props.socket.on("createStreamCallback", (e) => {
      setClientStreamProps(e.streamProps);
    });
    HttpClient.getEpisode(mediaId)
      .then((res) => setEpisode(res.episode))
      .catch((err) => {
        log.error("Failed to get EpisodeInfo", err);
        goBack();
      });
    return () => {
      props.socket.emit("cancelStream");
    };
  }, []);
  log.info(`Playing media ${mediaId} from ${libraryId}`);

  return (
    <Box sx={{ height: "100vh" }} key={window.location.pathname}>
      {!episode ? (
        <CircularProgress />
      ) : (
        <Loading
          waitFor={clientStreamProps}
          render={(t) => (
            <HlsPlayer
              {...props}
              hlsStreamProps={t}
              onReloadStream={(wanted) => {
                const req: CreateEpisodeHlsStreamRequest = {
                  library: libraryId,
                  mediaId: t.mediaInfo.id,
                  subtitles: getSubtitles(episode),
                  startOffset: wanted,
                };
                console.log(`Requesting stream reload: ${JSON.stringify(req)}`);
                props.socket.emit("createStream", req);
                setClientStreamProps(undefined);
              }}
              onUnmount={() => {
                // On Unmount
                // props.socket.emit("cancelStream");
              }}
              // TODO pull this ugly mess out
              onEnded={async () => {
                const fail = () => {
                  nav(WebRoutes.home);
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
            const req = {
              library: libraryId,
              mediaId: mediaId,
              startOffset: 0,
              subtitles: getSubtitles(episode),
            };
            console.log(`Requesting stream: ${JSON.stringify(req)}`);
            props.socket.emit("createStream", req);
          }}
        />
      )}
    </Box>
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

function getSubtitles(episode: EpisodeInfo) {
  const subs =
    episode.subtitleFiles[0]?.location ??
    episode.info.streams.find((it) => (it.codec_type as string) == "subtitle");
  log.info(`Found Subtitles: ${subs}`);
  return subs;
}
export default withSize({ monitorHeight: true })(MediaPlayer);
