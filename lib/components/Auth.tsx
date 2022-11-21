import React, { PropsWithChildren, useState } from "react";
import { Navigate } from "react-router";
import { CircularProgress } from "@mui/material";
import { WebLog } from "../log";
import { WebRoutes } from "../routes";
import { ServerRoutes } from "@rewind-media/rewind-protocol";

interface AuthProps extends PropsWithChildren {}

const log = WebLog.getChildCategory("Auth");

export const UserContext = React.createContext<Express.User | undefined>(
  undefined
);

export function Auth(props: AuthProps) {
  const [user, setUser] = useState<Express.User>();
  const [authFailed, setAuthFailed] = useState<boolean>(false);
  if (!user) {
    // TODO move to client
    fetch(ServerRoutes.Api.Auth.verify).then((res) => {
      if (res.status === 200) {
        res.json().then((json) => {
          setUser(json as Express.User);
          setAuthFailed(false);
        });
      } else if (res.status === 401) {
        setUser(undefined);
        setAuthFailed(true);
      }
    });
  }

  return user ? (
    <UserContext.Provider value={user}>{props.children}</UserContext.Provider>
  ) : authFailed ? (
    <Navigate to={WebRoutes.Auth.login} />
  ) : (
    <CircularProgress />
  );
}
