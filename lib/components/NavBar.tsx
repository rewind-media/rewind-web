import {
  AppBar,
  Box,
  Button,
  Drawer,
  IconButton,
  Toolbar,
} from "@mui/material";
import React, { PropsWithChildren, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { BrowseGallery, Home, Logout, Settings } from "@mui/icons-material";
import { RewindIcon } from "./RewindIcon";
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
            <RewindIcon style={{ width: "2.5em", height: "auto" }} />
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
          to={WebRoutes.Browse.root}
          onClick={() => setDrawerOpen(false)}
        >
          <Home />
        </ButtonLink>
        <ButtonLink
          to={WebRoutes.Browse.root}
          onClick={() => setDrawerOpen(false)}
        >
          <BrowseGallery />
        </ButtonLink>
        <ButtonLink
          to={WebRoutes.Browse.Settings.root}
          onClick={() => setDrawerOpen(false)}
        >
          <Settings />
        </ButtonLink>
        <Button
          onClick={() => {
            setDrawerOpen(false);
            fetch(ServerRoutes.Api.Auth.logout, {
              method: "POST",
            }).then((res) => {
              window.location.reload();
            });
          }}
        >
          <Logout />
        </Button>
      </Drawer>
      {props.children}
    </Box>
  );
}
