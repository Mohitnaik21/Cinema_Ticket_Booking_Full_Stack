import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
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

//change to initialUser
const initialPromo: { [key: string]: any } = {
  id: 0,
  code: "",
  discount: 0,
  start_date: 0,
  end_date: 0,
  is_released: true,
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
    axios.post('http://127.0.0.1:8000/promotions/').then(res => {
      const id = res.data;
      setRows((oldRows) => [...oldRows, { id, name: '', age: '', isNew: true }]);
      setRowModesModel((oldModel) => ({
        ...oldModel,
        [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
      }));
    }).catch(err => {
      console.log(err);
    });
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add record
      </Button>
    </GridToolbarContainer>
  );
}

function PromotionDataGrid() {
  const [rows, setRows] = React.useState([initialPromo]);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});

  //axios get from promotion
  React.useEffect(() => {
    axios.get('http://127.0.0.1:8000/promotions').then(function (res) {
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
    axios.delete(`http://127.0.0.1:8000/promotions/${id}`).then(res => {
      console.log(res);
    }).catch(error => {
      console.log(error);
    });
  };

  const handleSendClick = (id: GridRowId) => () => {
    axios.get(`http://127.0.0.1:8000/email-promotion?id=${id}`).then((res) => {
      console.log(res);
    }).catch((error) => { 
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
      axios.delete(`http://127.0.0.1:8000/promotions/${id}`).then(res => {
        console.log(res);
      }).catch(error => {
        console.log(error);
      });
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    //AXIOS UPDATE using updatedRow
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    axios.put(`http://127.0.0.1:8000/promotions/${newRow.id}/`, updatedRow).then((res) => {
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
  const promo_columns: GridColDef[] = [
    { 
      field: 'id', 
      headerName: 'id', 
      width: 50,
      editable: false,
    },
    {
      field: 'code',
      headerName: 'code',
      width: 200,
      editable: true,
    },
    {
        field: 'discount',
        headerName: 'discount',
        width: 100,
        editable: true,
    },
    {
        field: 'start_date',
        headerName: 'start_date',
        width: 250,
        editable: true,
    },
    {
        field: 'end_date',
        headerName: 'end_date',
        width: 250,
        editable: true,
    },
    {
        field: 'is_released',
        headerName: 'is_released',
        width: 100,
        editable: true,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 120,
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
          <GridActionsCellItem
            icon={<SendIcon />}
            label="Send"
            onClick={handleSendClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
        <DataGrid
          rows={rows}
          columns={promo_columns}
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

export default PromotionDataGrid;