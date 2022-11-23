import React, { PropsWithChildren } from "react";
import { ButtonLink } from "../ButtonLink";
import { Box, Container, Typography } from "@mui/material";
import { UserContext } from "../Auth";
import "../../declarations";
import { WebRoutes } from "../../routes";
import { NavBar } from "../NavBar";

export interface SettingsProps extends PropsWithChildren {}

export function Settings(props: SettingsProps) {
  return (
    <NavBar>
      <UserContext.Consumer>
        {(user) => (
          <>
            <Box>
              <ButtonLink to={WebRoutes.Settings.root}>
                <Typography>Settings</Typography>
              </ButtonLink>
              <ButtonLink to={WebRoutes.Settings.client}>
                <Typography>Client</Typography>
              </ButtonLink>
              <ButtonLink to={WebRoutes.Settings.user}>
                <Typography>User</Typography>
              </ButtonLink>
              {user?.permissions?.isAdmin ? (
                <ButtonLink to={WebRoutes.Settings.Admin.root}>
                  <Typography>Admin</Typography>
                </ButtonLink>
              ) : undefined}
            </Box>
            {props.children}
          </>
        )}
      </UserContext.Consumer>
    </NavBar>
  );
}
