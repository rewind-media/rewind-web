import React, { PropsWithChildren } from "react";
import { ButtonLink } from "../ButtonLink";
import { Box, Container, Typography } from "@mui/material";
import { UserContext } from "../Auth";
import "../../declarations";
import { WebRoutes } from "../../routes";

export interface SettingsProps extends PropsWithChildren {}

export function Settings(props: SettingsProps) {
  return (
    <UserContext.Consumer>
      {(user) => (
        <>
          <Box>
            <ButtonLink to={WebRoutes.Browse.Settings.root}>
              <Typography>Settings</Typography>
            </ButtonLink>
            <ButtonLink to={WebRoutes.Browse.Settings.client}>
              <Typography>Client</Typography>
            </ButtonLink>
            <ButtonLink to={WebRoutes.Browse.Settings.user}>
              <Typography>User</Typography>
            </ButtonLink>
            {user?.permissions?.isAdmin ? (
              <ButtonLink to={WebRoutes.Browse.Settings.Admin.root}>
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
