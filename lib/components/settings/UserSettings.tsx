import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  FormControlLabel,
  FormGroup,
  TextField,
  Typography,
} from "@mui/material";
import {SocketClient} from "../../models";

interface UserSettingsProps {
  socket: SocketClient;
}

export function UserSettings(props: UserSettingsProps) {
  const [openChangePasswordDialog, setOpenChangePasswordDialog] =
    useState(false);
  return (
    <Box>
      <Button onClick={() => setOpenChangePasswordDialog(true)}>
        Change Password
      </Button>
      <ChangePasswordDialog
        open={openChangePasswordDialog}
        onComplete={() => {
          setOpenChangePasswordDialog(false);
        }}
        socket={props.socket}
      />
    </Box>
  );
}

interface ChangePasswordDialogProps {
  open: boolean;
  onComplete: () => void;
  socket: SocketClient;
}

function validate(
  oldPassword: string,
  password: string,
  verifyPassword: string
): boolean {
  return (
    password == verifyPassword && password.length > 8 && password != oldPassword
  );
}

// TODO proper form validation
function ChangePasswordDialog(props: ChangePasswordDialogProps) {
  const [error, setError] = useState<string>();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [verifyNewPassword, setVerifyNewPassword] = useState("");
  const [complete, setComplete] = useState(false);

  props.socket.on("changePasswordCallback", (res) => {
    if (res.success) {
      setComplete(true);
    } else {
      setError("Error");
    }
  });

  useEffect(() => {
    setError(undefined);
    setCurrentPassword("");
    setNewPassword("");
    setVerifyNewPassword("");
    if (complete) {
      setComplete(false);
      props.onComplete();
    }
  }, [complete, props.open]);

  useEffect(() => {
    props.socket.on("createUserCallback", (res) => {
      if (res.created) {
        setComplete(true);
      }
    });
  });

  const valid = validate(currentPassword, newPassword, verifyNewPassword);

  return (
    <Dialog open={props.open}>
      <FormGroup>
        {error ? <Typography color="red">{error}</Typography> : <></>}
        <FormControlLabel
          control={
            <TextField onChange={(it) => setCurrentPassword(it.target.value)} />
          }
          label="Current Password"
        />
        <FormControlLabel
          control={
            <TextField onChange={(it) => setNewPassword(it.target.value)} />
          }
          label="New Password"
        />
        <FormControlLabel
          control={
            <TextField
              onChange={(it) => setVerifyNewPassword(it.target.value)}
            />
          }
          label="Verify New Password"
        />
        <Button
          disabled={!valid}
          onClick={() => {
            props.socket.emit("changePassword", {
              oldPassword: currentPassword,
              newPassword: newPassword,
            });
          }}
        >
          Submit
        </Button>
      </FormGroup>
    </Dialog>
  );
}
