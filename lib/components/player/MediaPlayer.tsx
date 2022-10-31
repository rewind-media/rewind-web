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
  ShowEpisodeInfo,
  ShowSeasonInfo,
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
              onEnded={() => {
                const fail = () => {
                  nav(ServerRoutes.Web.Home.Browser.root);
                };
                props.socket.once(
                  "getShowEpisodeCallback",
                  ({ episode: currEpisode }) => {
                    if (currEpisode) {
                      props.socket.once("listShowEpisodesCallback", (res) => {
                        const sortedEpisodes =
                          res.episodes.sort(episodeComparator);
                        log.info(
                          `Sorted episodes :${JSON.stringify(
                            sortedEpisodes.map((it) => {
                              return {
                                name: it.name,
                                episode: it.details?.episode,
                              };
                            })
                          )}`
                        );
                        const curEpIndex = sortedEpisodes.findIndex(
                          (it) => it.id == currEpisode.id
                        );
                        const nextEpisode =
                          curEpIndex !== -1
                            ? sortedEpisodes[curEpIndex + 1]
                            : undefined;
                        if (nextEpisode) {
                          log.info(
                            `Found next episode ${JSON.stringify(nextEpisode)}`
                          );
                          goToNextEpisode(
                            t.mediaInfo.libraryName,
                            nextEpisode.id
                          );
                        } else {
                          props.socket.once(
                            "listShowSeasonsCallback",
                            ({ seasons: seasons }) => {
                              const sortedSeasons =
                                seasons.sort(seasonComparator);
                              log.info(
                                `Sorted seasons :${JSON.stringify(
                                  sortedSeasons.map((it) => {
                                    return {
                                      name: it.seasonName,
                                      episode: it.details?.seasonnumber,
                                    };
                                  })
                                )}`
                              );
                              const currSeasonIndex = sortedSeasons.findIndex(
                                (value) => value.id == currEpisode.seasonId
                              );
                              const nextSeason =
                                currSeasonIndex !== -1
                                  ? sortedSeasons[currSeasonIndex + 1]
                                  : undefined;
                              if (nextSeason) {
                                props.socket.once(
                                  "listShowEpisodesCallback",
                                  ({ episodes: episodes }) => {
                                    const nextSeasonFirstEp = episodes
                                      .sort(episodeComparator)
                                      .at(0);
                                    if (nextSeasonFirstEp) {
                                      goToNextEpisode(
                                        nextSeasonFirstEp.libraryName,
                                        nextSeasonFirstEp.id
                                      );
                                    } else {
                                      fail();
                                    }
                                  }
                                );
                                props.socket.emit("listShowEpisodes", {
                                  season: nextSeason.id,
                                });
                              } else {
                                fail();
                              }
                            }
                          );
                          props.socket.emit("listShowSeasons", {
                            show: currEpisode.showId,
                          });
                        }
                      });
                      props.socket.emit("listShowEpisodes", {
                        season: currEpisode.seasonId,
                      });
                    } else {
                      fail();
                    }
                  }
                );
                props.socket.emit("getShowEpisode", {
                  episode: t.mediaInfo.id,
                });
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

const episodeComparator = (a: ShowEpisodeInfo, b: ShowEpisodeInfo) => {
  return (a.details?.episode ?? 0) - (b.details?.episode ?? 0);

  // if (b.details?.episode && a.details?.episode) {
  // return a.details.episode - b.details.episode;
  // } else {
  //   return naturalCompare(a.name, b.name);
  // }
};
const seasonComparator = (a: ShowSeasonInfo, b: ShowSeasonInfo) => {
  return (a.details?.seasonnumber ?? 0) - (b.details?.seasonnumber ?? 0);

  // if (b.details?.seasonnumber && a.details?.seasonnumber) {
  // return a.details.seasonnumber - b.details.seasonnumber;
  // } else {
  //   return naturalCompare(a.seasonName, b.seasonName);
  // }
};

export default withSize({ monitorHeight: true })(MediaPlayer);
