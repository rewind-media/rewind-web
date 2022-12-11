import {
  AppBar,
  Box,
  Button,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { PropsWithChildren, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { Home, Logout, Settings } from "@mui/icons-material";
import { RewindIconTape } from "./RewindIconTape";
import { ButtonLink } from "./ButtonLink";
import { WebRoutes } from "../routes";
import { ServerRoutes } from "@rewind-media/rewind-protocol";

export interface NavBarProps extends PropsWithChildren {}

export function NavBar(props: NavBarProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
      }}
    >
      <AppBar>
        <Toolbar>
          <IconButton
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <ButtonLink to={WebRoutes.root}>
            <RewindIconTape style={{ width: "4em", height: "auto" }} />
          </ButtonLink>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Drawer
        anchor="left"
        sx={{ width: "25vw" }}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <ButtonLink
          to={WebRoutes.root}
          onClick={() => setDrawerOpen(false)}
          style={{ justifyContent: "start" }}
        >
          <Home style={{ height: "1em" }} />
          <Typography style={{ marginLeft: "0.5em", height: "1em" }}>
            Home
          </Typography>
        </ButtonLink>
        <ButtonLink
          to={WebRoutes.Settings.root}
          onClick={() => setDrawerOpen(false)}
          style={{ justifyContent: "start" }}
        >
          <Settings style={{ height: "1em" }} />
          <Typography style={{ marginLeft: "0.5em", height: "1em" }}>
            Settings
          </Typography>
        </ButtonLink>
        <Button
          onClick={() => {
            setDrawerOpen(false);
            fetch(ServerRoutes.Api.Auth.logout, {
              method: "POST",
            }).then(() => {
              window.location.reload();
            });
          }}
          style={{ justifyContent: "start" }}
        >
          <Logout style={{ height: "1em" }} />
          <Typography style={{ marginLeft: "0.5em", height: "1em" }}>
            Logout
          </Typography>
        </Button>
      </Drawer>
      {props.children}
    </Box>
  );
}
