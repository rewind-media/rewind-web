import { withSize } from "react-sizeme";
import { HlsPlayer } from "./HlsPlayer";
import React, { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router";
import { Box, CircularProgress } from "@mui/material";
import { WebLog } from "../../log";
import {
  HlsStreamProps,
  ServerRoutes,
  EpisodeInfo,
  SeasonInfo,
  HttpClient,
  StreamStatus,
} from "@rewind-media/rewind-protocol";
import { WebRoutes } from "../../routes";
import { Duration } from "durr";
import { CreateHlsStreamRequest } from "@rewind-media/rewind-protocol/dist/socket";

interface MediaPlayerProps {
  readonly onBackButton?: () => void;
  readonly backButtonPath?: string;
}

const log = WebLog.getChildCategory("MediaPlayer");

function MediaPlayer(props: MediaPlayerProps) {
  const { mediaId, libraryId } = useParams();
  const [episode, setEpisode] = useState<EpisodeInfo>();
  React.useEffect(() => {}, [window.location]);
  const [clientStreamProps, setClientStreamProps] = useState<HlsStreamProps>();
  const [streamStatus, setStreamStatus] = useState<StreamStatus>();
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
    const timer = setInterval(async () => {
      if (clientStreamProps) {
        setStreamStatus(await HttpClient.heartbeatStream(clientStreamProps.id));
      } else {
        setStreamStatus(undefined);
      }
    }, Duration.seconds(1).millis);
    return () => {
      clearInterval(timer);
    };
  }, [clientStreamProps]);

  React.useEffect(() => {
    HttpClient.getEpisode(mediaId)
      .then((res) => setEpisode(res.episode))
      .catch((err) => {
        log.error("Failed to get EpisodeInfo", err);
        goBack();
      });
    return () => {
      if (clientStreamProps) {
        HttpClient.deleteStream(clientStreamProps.id);
      }
    };
  }, []);

  React.useEffect(() => {
    if (episode) {
      const req = {
        library: libraryId,
        mediaId: mediaId,
        startOffset: 0,
        subtitles: getSubtitles(episode),
      };
      console.log(`Requesting stream: ${JSON.stringify(req)}`);
      HttpClient.createStream(req).then((it) =>
        setClientStreamProps(it.streamProps)
      );
    }
  }, [episode]);
  log.info(`Playing media ${mediaId} from ${libraryId}`);

  return (
    <Box sx={{ height: "100vh" }} key={window.location.pathname}>
      {!episode || !clientStreamProps || streamStatus != "AVAILABLE" ? (
        <CircularProgress />
      ) : (
        <HlsPlayer
          {...props}
          hlsStreamProps={clientStreamProps}
          onReloadStream={(wanted) => {
            const req: CreateHlsStreamRequest = {
              library: libraryId,
              mediaId: clientStreamProps.mediaInfo.id,
              subtitles: getSubtitles(episode),
              startOffset: wanted,
            };
            console.log(`Requesting stream reload: ${JSON.stringify(req)}`);
            setClientStreamProps(undefined);
            setStreamStatus(undefined);
            HttpClient.createStream(req).then(
              (it: ServerRoutes.Api.Stream.CreateResponse) =>
                setClientStreamProps(it.streamProps)
            );
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
              await HttpClient.getEpisode(clientStreamProps.mediaInfo.id)
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
              goToNextEpisode(
                clientStreamProps.mediaInfo.libraryName,
                nextEpisode.id
              );
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
                  clientStreamProps.mediaInfo.libraryName,
                  nextSeasonFirstEpisode.id
                );
              } else {
                fail();
              }
            }
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
