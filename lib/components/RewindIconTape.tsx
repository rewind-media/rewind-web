import React from "react";
import RewindIconBasicSvg from "../../imgSrc/RewindIcon-Basic.svg";
import RewindIconTapeSvg from "../../imgSrc/RewindIcon-Tape.svg";
export interface RewindIconProps
  extends Omit<
    React.DetailedHTMLProps<
      React.ImgHTMLAttributes<HTMLImageElement>,
      HTMLImageElement
    >,
    keyof { src: string; alt: string }
  > {}

export const RewindIconTape = (props: RewindIconProps) => (
  <img {...props} src={RewindIconTapeSvg} alt={"Rewind Icon Tape"} />
);

export const RewindIconBasic = (props: RewindIconProps) => (
  <img {...props} src={RewindIconBasicSvg} alt={"Rewind Icon Basic"} />
);
