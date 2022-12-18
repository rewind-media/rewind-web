import React, { PropsWithChildren } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { darkTheme } from "./Theme";
import { CookiesProvider } from "react-cookie";
import "../static/css/Root.css";

export function Root(props: PropsWithChildren) {
  return (
    // <React.StrictMode> // TODO Reenable StrictMode
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <CookiesProvider>{props.children}</CookiesProvider>
    </ThemeProvider>
    // </React.StrictMode>
  );
}
