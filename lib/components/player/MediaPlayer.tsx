import { withSize } from "react-sizeme";
import { HlsPlayer } from "./HlsPlayer";
import React, { useState } from "react";
import { Navigate, useParams } from "react-router";
import { Loading } from "../Loading";
import { Box } from "@mui/material";
import { WebLog } from "../../log";
import { PropsWithSocket } from "../../models";
import { HlsStreamProps, ServerRoutes } from "@rewind-media/rewind-protocol";

interface MediaPlayerProps extends PropsWithSocket {
  readonly onBackButton?: () => void;
  readonly backButtonPath?: string;
}

const log = WebLog.getChildCategory("MediaPlayer");

function MediaPlayer(props: MediaPlayerProps) {
  const { id, library } = useParams();
  const [clientStreamProps, setClientStreamProps] = useState<HlsStreamProps>();

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
      <Box sx={{ height: "100vh" }}>
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
            />
          )}
          onWaitOnce={() =>
            props.socket.emit("createStream", {
              library: library,
              mediaId: id,
              startOffset: 0,
            })
          }
        />
      </Box>
    ) : (
      <Navigate to={props.backButtonPath ?? ServerRoutes.root} />
    )
  ) : (
    <Navigate to={props.backButtonPath ?? ServerRoutes.root} />
  );
}

export default withSize({ monitorHeight: true })(MediaPlayer);
