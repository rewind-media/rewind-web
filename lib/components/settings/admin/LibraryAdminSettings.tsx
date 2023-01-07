import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  Button,
  ButtonGroup,
  Dialog,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { SocketClient } from "../../../models";
import {
  HttpClient,
  Library,
  LibraryType,
} from "@rewind-media/rewind-protocol";
import { List } from "immutable";

export interface LibraryAdminSettingsProps {
  socket: SocketClient;
}

const columns: GridColDef[] = [
  { field: "name", headerName: "Name" },
  {
    field: "type",
    headerName: "Type",
  },
  { field: "rootPaths", headerName: "Root Paths" },
];

interface DeleteLibraryDialogProps {
  open: boolean;
  onClose: () => void;
  selectedIds: string[];
}

function DeleteLibraryDialog(props: DeleteLibraryDialogProps) {
  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <Typography color="red">{`Delete ${props.selectedIds.length} users?`}</Typography>
      <Button
        onClick={() =>
          HttpClient.deleteLibraries({ names: props.selectedIds }).then(() =>
            props.onClose()
          )
        }
      >
        Confirm
      </Button>
      <Button onClick={() => props.onClose()}>Cancel</Button>
    </Dialog>
  );
}

export function LibraryAdminSettings(props: LibraryAdminSettingsProps) {
  const [libraries, setLibraries] = useState<Library[]>([] as Library[]);
  const [selectedIds, setSelectedIds] = useState<string[]>([] as string[]);
  const [createLibraryDialogOpen, setCreateLibraryDialogOpen] = useState(false);
  const [deleteLibrariesDialogOpen, setDeleteLibrariesDialogOpen] =
    useState(false);

  const fetchLibraries = () =>
    HttpClient.listLibraries().then((it) => setLibraries(it.libraries));

  useEffect(() => {
    fetchLibraries().then();
  }, [createLibraryDialogOpen, deleteLibrariesDialogOpen]);

  return (
    <>
      <CreateLibraryDialog
        libraries={libraries}
        open={createLibraryDialogOpen}
        onComplete={() => {
          setCreateLibraryDialogOpen(false);
          fetchLibraries().then();
        }}
        socket={props.socket}
      />
      <DeleteLibraryDialog
        open={deleteLibrariesDialogOpen}
        onClose={() => setDeleteLibrariesDialogOpen(false)}
        selectedIds={selectedIds}
      />
      <ButtonGroup>
        <Button onClick={() => setCreateLibraryDialogOpen(true)}>Create</Button>
        {/*<Button disabled={selectedIds.length != 1}>Modify</Button>*/}
        <Button
          disabled={selectedIds.length < 1}
          onClick={() => setDeleteLibrariesDialogOpen(true)}
        >
          Delete
        </Button>
      </ButtonGroup>
      <DataGrid
        getRowId={(row: Library) => row.name}
        rows={libraries}
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

interface CreateLibraryDialogProps {
  open: boolean;
  onComplete: () => void;
  libraries: Library[];
  socket: SocketClient;
}

function validate(existingLibraries: Library[], name: string): boolean {
  return !existingLibraries.find((it) => it.name == name);
}

// TODO proper form validation
function CreateLibraryDialog(props: CreateLibraryDialogProps) {
  const [error, setError] = useState<string>();
  const [name, setName] = useState("");
  const [rootPaths, setRootPaths] = useState<List<string>>(List());
  const [type, setType] = useState(LibraryType.Show);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    setError(undefined);
    setName("");
    setRootPaths(List());
    setType(LibraryType.Show);
    if (complete) {
      setComplete(false);
      props.onComplete();
    }
  }, [complete, props.open]);

  const valid = validate(props.libraries, name);
  const menuItems: JSX.Element[] = [];
  for (const type in LibraryType) {
    menuItems.push(<MenuItem value={type}>{type}</MenuItem>);
  }
  return (
    <Dialog open={props.open} onClose={() => setComplete(true)}>
      <FormGroup>
        {error ? <Typography color="red">{error}</Typography> : <></>}
        <FormControlLabel
          control={<TextField onChange={(it) => setName(it.target.value)} />}
          label="Name"
        />
        <FormControlLabel
          control={
            <TextField
              onChange={(it) => setRootPaths(List(it.target.value.split(" ")))}
            />
          }
          label="Root Paths"
        />
        <FormControlLabel
          control={
            <Select
              onChange={(it: SelectChangeEvent<string>) =>
                setType((LibraryType as any)[it.target.value])
              }
              value={type}
            >
              {...menuItems}
            </Select>
          }
          label="Library Type"
        />
        <Button
          disabled={!valid}
          onClick={() =>
            HttpClient.createLibrary({
              name: name,
              rootPaths: rootPaths.toArray(),
              type: type,
            }).then(async (it: Response) =>
              it.ok ? props.onComplete() : setError(await it.text())
            )
          }
        >
          Submit
        </Button>
        <Button onClick={() => setComplete(true)}>Close</Button>
      </FormGroup>
    </Dialog>
  );
}
