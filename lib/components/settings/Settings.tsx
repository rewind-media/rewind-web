import React, { PropsWithChildren } from "react";
import { ButtonLink } from "../ButtonLink";
import { Box, Container, Typography } from "@mui/material";
import { UserContext } from "../Auth";
import { ServerRoutes } from "@rewind-media/rewind-protocol";
import "../../declarations";

export interface SettingsProps extends PropsWithChildren {}

export function Settings(props: SettingsProps) {
  return (
    <UserContext.Consumer>
      {(user) => (
        <>
          <Box>
            <ButtonLink to={ServerRoutes.Web.Home.Browser.Settings.root}>
              <Typography>Settings</Typography>
            </ButtonLink>
            <ButtonLink to={ServerRoutes.Web.Home.Browser.Settings.client}>
              <Typography>Client</Typography>
            </ButtonLink>
            <ButtonLink to={ServerRoutes.Web.Home.Browser.Settings.user}>
              <Typography>User</Typography>
            </ButtonLink>
            {user?.permissions?.isAdmin ? (
              <ButtonLink
                to={ServerRoutes.Web.Home.Browser.Settings.Admin.root}
              >
                <Typography>Admin</Typography>
              </ButtonLink>
            ) : undefined}
          </Box>
          {props.children}
        </>
      )}
    </UserContext.Consumer>
  );
}
