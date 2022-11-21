import React from "react";
import RewindIconSvg from "../static/img/RewindIcon.svg";
export interface RewindIconProps
  extends Omit<
    React.DetailedHTMLProps<
      React.ImgHTMLAttributes<HTMLImageElement>,
      HTMLImageElement
    >,
    keyof { src: string; alt: string }
  > {}

export const RewindIcon = (props: RewindIconProps) => (
  <img {...props} src={RewindIconSvg} alt={"Rewind Icon"} />
);
