import React from "react";
import { Box, Typography } from "@mui/material";
import { ButtonLink } from "../../ButtonLink";
import { Outlet } from "react-router-dom";
import { WebRoutes } from "../../../routes";

export function AdminSettings() {
  return (
    <>
      <Box>
        <ButtonLink to={WebRoutes.Browse.Settings.Admin.root}>
          <Typography>Settings</Typography>
        </ButtonLink>
        <ButtonLink to={WebRoutes.Browse.Settings.Admin.users}>
          <Typography>User</Typography>
        </ButtonLink>
      </Box>
      <Outlet />
    </>
  );
}
