import React from "react";
import { Box, Typography } from "@mui/material";
import { ButtonLink } from "../../ButtonLink";
import { ServerRoutes } from "@rewind-media/rewind-protocol";
import { Outlet } from "react-router-dom";

export function AdminSettings() {
  return (
    <>
      <Box>
        <ButtonLink to={ServerRoutes.Web.Home.Browser.Settings.Admin.root}>
          <Typography>Settings</Typography>
        </ButtonLink>
        <ButtonLink to={ServerRoutes.Web.Home.Browser.Settings.Admin.users}>
          <Typography>User</Typography>
        </ButtonLink>
      </Box>
      <Outlet />
    </>
  );
}
