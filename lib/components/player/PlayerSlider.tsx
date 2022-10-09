import React, { useRef, useState } from "react";
import ReactPlayer from "react-player";
import { SizeMe } from "react-sizeme";
import { LinearProgress } from "@mui/material";
import { WebLog } from "../../log";

const log = WebLog.getChildCategory("PlayerSlider");

export interface PlayerSliderProps {
  played: number;
  startOffset: number;
  duration: number;
  buffered: number;
  playerRef: React.RefObject<ReactPlayer>;
  setPlayed: (value: number) => void;
  setBuffered: (value: number) => void;
  setDesiredReloadTimestamp: (value: number | undefined) => void;
}

export function PlayerSlider(props: PlayerSliderProps) {
  const [, setReloadingStream] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  return (
    <SizeMe>
      {({ size }) => (
        <div
          ref={sliderRef}
          style={{
            width: "100%",
          }}
        >
          <LinearProgress
            sx={{
              height: 10,
              borderRadius: 5,
              width: "100%",
              backgroundColor: "rgba(142,142,142,0.13)",
            }}
            variant="buffer"
            value={(100 * (props.played + props.startOffset)) / props.duration}
            valueBuffer={
              (100 * (props.buffered + props.startOffset)) / props.duration
            }
            onClick={(event) => {
              const parentLeft =
                sliderRef.current?.getBoundingClientRect()?.left;
              const width = size.width;
              if (width && parentLeft) {
                const offset = event.clientX - parentLeft;
                const percent = offset / width;
                const wanted = percent * props.duration;

                log.debug(
                  `Width: ${width}, Offset: ${offset}, ParentLeft: ${parentLeft}, event.clientX: ${event.clientX}, startOffset: ${props.startOffset}, played: ${props.played}`
                );

                const available =
                  props.playerRef.current?.getDuration() ?? props.buffered;
                if (
                  wanted < props.startOffset ||
                  wanted > props.startOffset + available
                ) {
                  setReloadingStream((cur) => {
                    if (!cur) {
                      props.setPlayed(0);
                      props.setBuffered(0);
                      props.setDesiredReloadTimestamp(wanted);
                      return true;
                    }
                    return !cur;
                  });
                } else {
                  props.playerRef.current?.seekTo(
                    wanted - props.startOffset,
                    "seconds"
                  );
                  props.setPlayed(wanted - props.startOffset);
                  log.info("Reusing stream");
                }
                event.stopPropagation();
              }
            }}
          />
        </div>
      )}
    </SizeMe>
  );
}
