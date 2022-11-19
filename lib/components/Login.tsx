import { Button, FormGroup, Grid, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { ServerRoutes } from "@rewind-media/rewind-protocol";

export function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>();

  const nav = useNavigate();

  function submit() {
    fetch(ServerRoutes.Api.Auth.login, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },

      //make sure to serialize your JSON body
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    }).then((res) => {
      if (res.ok) {
        nav(ServerRoutes.Web.root);
      } else {
        setError("Incorrect username or password.");
      }
    });
    return false;
  }

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="center"
      sx={{
        width: "100%",
        height: "100vh",
      }}
    >
      <Grid
        item
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        sx={{
          width: "100%",
          height: "100%",
        }}
      >
        <Grid item>
          {error ? <Typography color="red">{error}</Typography> : <></>}
          <form
            action="lib/components/Login"
            method="post"
            onSubmit={(e) => {
              submit();
              e.preventDefault();
              return false;
            }}
          >
            <FormGroup>
              <TextField
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                helperText="Username"
                required
                onChange={(it) => setUsername(it.target.value)}
              />
              <TextField
                id="password"
                name="password"
                type="password"
                helperText="Password"
                autoComplete="password"
                required
                onChange={(it) => setPassword(it.target.value)}
              />
              <Button type="submit">Sign in</Button>
            </FormGroup>
          </form>
        </Grid>
      </Grid>
    </Grid>
  );
}
