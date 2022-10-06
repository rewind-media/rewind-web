import { Button } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import React from "react";
import { useNavigate } from "react-router";
import { PropsWithSocket } from "../../models";

interface PlayerBackButtonProps extends PropsWithSocket {
  openControls: boolean;
  streamId: string;
  readonly onBackButton?: () => void;
  readonly backButtonPath?: string;
}

export function PlayerBackButton(props: PlayerBackButtonProps) {
  const nav = useNavigate();
  return (
    <Button
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        opacity: 0.8,
        backgroundColor: "#000000",
        visibility: props.openControls ? "visible" : "hidden",
        zIndex: 1,
      }}
      onClick={(e) => {
        props.socket.emit("cancelStream");
        if (props.backButtonPath) {
          nav(props.backButtonPath);
        } else {
          nav(-1);
        }
        if (props.onBackButton) {
          props.onBackButton();
        }
        e.stopPropagation();
      }}
    >
      <ArrowBack />
    </Button>
  );
}
