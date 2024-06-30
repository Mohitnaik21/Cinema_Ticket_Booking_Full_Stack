import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import axios from "axios";
import {
  GridRowsProp,
  GridRowModesModel,
  GridRowModes,
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';
import {
  randomCreatedDate,
  randomTraderName,
  randomId,
  randomArrayItem,
} from '@mui/x-data-grid-generator';

const initialUser: { [key: string]: any } = {
  id: "",
  email: "",
  password: "",
  first_name: "",
  last_name: "",
  phone_number: "",
  role: "",
  is_active: "",
  is_suspended: "",
  city: "",
  country: "",
  postal_code: "",
  state: "",
  street: "",
  unit: "",
  forgot_password_code: "",
  verification_code: "",
  receive_promotions: "",
};

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
  ) => void;
}

function EditToolbar(props: EditToolbarProps) {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    //AXIOS CREATE read response and set id 
    const id = randomId();
    setRows((oldRows) => [...oldRows, { id, name: '', age: '', isNew: true }]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add record
      </Button>
    </GridToolbarContainer>
  );
}

function UserDataGrid() {
  const [rows, setRows] = React.useState([initialUser]);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});

  //axios get from all users
  React.useEffect(() => {
    axios.get('http://127.0.0.1:8000/users').then(function (res) {
        setRows(res.data);
    }).catch(function (error) {
        console.error('Axios error', error);
    });
  }, []);

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    //AXIOS DELETE using id 
    setRows(rows.filter((row) => row.id !== id));
    axios.delete(`http://127.0.0.1:8000/users/${id}`).then(res => {
      console.log(res);
    }).catch(error => {
      console.log(error);
    });
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    //AXIOS UPDATE using updatedRow
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    axios.put(`http://127.0.0.1:8000/users/${newRow.id}/`, updatedRow).then((res) => {
      console.log(res);
    }).catch((error) => { 
      console.log(error);
    });
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  //define user columns
  const user_columns: GridColDef[] = [
    { 
      field: 'id', 
      headerName: 'id', 
      width: 50,
      editable: false,
    },
    {
      field: 'email',
      headerName: 'email',
      width: 150,
      editable: true,
    },
    {
        field: 'password',
        headerName: 'password',
        width: 100,
        editable: false,
    },
    {
        field: 'first_name',
        headerName: 'first_name',
        width: 100,
        editable: true,
    },
    {
        field: 'last_name',
        headerName: 'last_name',
        width: 120,
        editable: true,
    },
    {
        field: 'phone_number',
        headerName: 'phone_number',
        width: 150,
        editable: true,
    },
    {
        field: 'role',
        headerName: 'role',
        width: 150,
        editable: true,
    },
    {
        field: 'is_active',
        headerName: 'is_active',
        width: 150,
        editable: true,
      },
    {
        field: 'is_suspended',
        headerName: 'is_suspended',
        width: 150,
        editable: true,
    },
    {
        field: 'city',
        headerName: 'city',
        width: 150,
        editable: true,
    },
    {
        field: 'country',
        headerName: 'country',
        width: 150,
        editable: true,
    },
    {
        field: 'postal_code',
        headerName: 'postal_code',
        width: 100,
        editable: true,
    },
    {
        field: 'state',
        headerName: 'state',
        width: 100,
        editable: true,
    },
    {
        field: 'street',
        headerName: 'street',
        width: 100,
        editable: true,
    },
    {
        field: 'unit',
        headerName: 'unit',
        width: 100,
        editable: true,
    },
    {
        field: 'forgot_password_code',
        headerName: 'forgot_password_code',
        width: 100,
        editable: true,
    },
    {
        field: 'verification_code',
        headerName: 'verification_code',
        width: 100,
        editable: true,
    },
    {
        field: 'receive_promotions',
        headerName: 'receive_promotions',
        width: 100,
        editable: true,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
        <DataGrid
          rows={rows}
          columns={user_columns}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          slots={{
            toolbar: EditToolbar,
          }}
          slotProps={{
            toolbar: { setRows, setRowModesModel },
          }}
        />
  );
}

export default UserDataGrid;