import { SvgIcon, SvgIconProps } from "@mui/material";
import React from "react";
// import RewindIconSvg from "../static/img/RewindIcon.svg";
export interface RewindIconProps extends SvgIconProps {}

export function RewindIcon(props: RewindIconProps) {
  return (
    <SvgIcon
      // component={RewindIconSvg}
      sx={{ width: "auto", height: "2.5em", ...props.sx }}
      viewBox={"0 0 60 60"}
    />
  );
}
