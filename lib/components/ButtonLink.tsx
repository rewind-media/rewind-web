import React from "react";
import { Button, ButtonProps } from "@mui/material";
import { NavigateOptions, useNavigate } from "react-router";

interface ButtonLinkProps extends ButtonProps {
  readonly to: string;
  readonly navOptions?: NavigateOptions;
}

export function ButtonLink(props: ButtonLinkProps) {
  const nav = useNavigate();
  return (
    <Button
      {...props}
      onClick={(event) => {
        if (props.onClick) props.onClick(event);
        nav(props.to, props.navOptions);
      }}
    />
  );
}
