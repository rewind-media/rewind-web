import {
  Box,
  Button,
  FormControlLabel,
  FormGroup,
  TextField,
  Typography,
} from "@mui/material";
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
    <Box>
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
          <FormControlLabel
            control={
              <TextField
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                onChange={(it) => setUsername(it.target.value)}
              />
            }
            label={"Username"}
          />
          <FormControlLabel
            control={
              <TextField
                id="password"
                name="password"
                type="password"
                autoComplete="password"
                required
                onChange={(it) => setPassword(it.target.value)}
              />
            }
            label={"Password"}
          />
          <Button type="submit">Sign in</Button>
        </FormGroup>
      </form>
    </Box>
  );
}
