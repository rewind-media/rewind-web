import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import {
  Button,
  ButtonGroup,
  Checkbox,
  Dialog,
  FormControlLabel,
  FormGroup,
  TextField,
  Typography,
} from "@mui/material";
import { SocketClient } from "../../../models";

export interface UserAdminSettingsProps {
  socket: SocketClient;
}

const columns: GridColDef[] = [
  { field: "username", headerName: "Username" },
  {
    field: "permissions.isAdmin",
    headerName: "Admin",
    valueGetter: (row: GridValueGetterParams<Express.User>) =>
      row.value?.permissions?.isAdmin ? "true" : "false",
  },
];

export function UserAdminSettings(props: UserAdminSettingsProps) {
  const [users, setUsers] = useState<Express.User[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [createUserDialogOpen, setCreateUserDialogOpen] = useState(false);
  const [deleteUsersDialogOpen, setDeleteUsersDialogOpen] = useState(false);

  useEffect(() => {
    props.socket.on("getUsersCallback", (response) => {
      setUsers(response.users);
    });
    props.socket.on("deleteUsersCallback", (res) => {
      setDeleteUsersDialogOpen(false);
      props.socket.emit("listUsers");
    });
    props.socket.emit("listUsers");
  }, []);

  return (
    <>
      <CreateUserDialog
        open={createUserDialogOpen}
        onComplete={() => {
          setCreateUserDialogOpen(false);
          props.socket.emit("listUsers");
        }}
        socket={props.socket}
      />
      <Dialog open={deleteUsersDialogOpen}>
        <Typography color="red">{`Delete ${selectedIds.length} users?`}</Typography>
        <Button
          onClick={() => {
            props.socket.emit("deleteUsers", { usernames: selectedIds });
          }}
        >
          Confirm
        </Button>
        <Button onClick={() => setDeleteUsersDialogOpen(false)}>Cancel</Button>
      </Dialog>
      <ButtonGroup>
        <Button onClick={() => setCreateUserDialogOpen(true)}>Create</Button>
        {/*<Button disabled={selectedIds.length != 1}>Modify</Button>*/}
        <Button
          disabled={selectedIds.length < 1}
          onClick={() => setDeleteUsersDialogOpen(true)}
        >
          Delete
        </Button>
      </ButtonGroup>
      <DataGrid
        getRowId={(row) => row.username}
        rows={users}
        columns={columns}
        pageSize={100}
        rowsPerPageOptions={[100]}
        checkboxSelection
        onSelectionModelChange={(ids) => {
          setSelectedIds(ids.map((it) => it.toString()));
        }}
      ></DataGrid>
    </>
  );
}

interface CreateUserDialogProps {
  open: boolean;
  onComplete: () => void;
  socket: SocketClient;
}

function validate(
  username: string,
  password: string,
  verifyPassword: string,
  isAdmin: boolean
): boolean {
  return (
    password == verifyPassword && password.length > 8 && username.length > 1
  );
}

// TODO proper form validation
function CreateUserDialog(props: CreateUserDialogProps) {
  const [error, setError] = useState<string>();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [complete, setComplete] = useState(false);

  props.socket.on("createUserCallback", (res) => {
    if (res.created) {
      setComplete(true);
    } else {
      setError("Error");
    }
  });

  useEffect(() => {
    setError(undefined);
    setUsername("");
    setPassword("");
    setVerifyPassword("");
    setIsAdmin(false);
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

  const valid = validate(username, password, verifyPassword, isAdmin);

  return (
    <Dialog open={props.open}>
      <FormGroup>
        {error ? <Typography color="red">{error}</Typography> : <></>}
        <FormControlLabel
          control={
            <TextField onChange={(it) => setUsername(it.target.value)} />
          }
          label="Username"
        />
        <FormControlLabel
          control={
            <TextField onChange={(it) => setPassword(it.target.value)} />
          }
          label="Password"
        />
        <FormControlLabel
          control={
            <TextField onChange={(it) => setVerifyPassword(it.target.value)} />
          }
          label="Verify Password"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={isAdmin}
              onChange={(it) => setIsAdmin(it.target.checked)}
            />
          }
          label="Admin"
        />
        <Button
          disabled={!valid}
          onClick={() => {
            props.socket.emit("createUser", {
              username: username,
              password: password,
              permissions: {
                isAdmin: isAdmin,
              },
            });
          }}
        >
          Submit
        </Button>
      </FormGroup>
    </Dialog>
  );
}
