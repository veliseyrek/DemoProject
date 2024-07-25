import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem, Snackbar, Alert,IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { getConfigurations, addConfiguration,deleteConfiguration  } from '../services/api';
import { Delete,Logout } from '@mui/icons-material'; 
import '../assets/configuration.css';

const Configuration = () => {
  const [configs, setConfigs] = useState([]);
  const [open, setOpen] = useState(false);
  const [buildingType, setBuildingType] = useState('');
  const [buildingCost, setBuildingCost] = useState('');
  const [constructionTime, setConstructionTime] = useState('');
  const [types, setTypes] = useState(['Farm', 'Academy', 'Headquarters', 'LumberMill', 'Barracks']);
  const [addedTypes, setAddedTypes] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
   
    const fetchConfigs = async () => {
      try {
        const data = await getConfigurations();
        setConfigs(data);
        setAddedTypes(data.map(config => config.buildingType));
      } catch (error) {
        console.error(error);
      }
    };

    const fetchData = async () => {
      debugger;
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/login'); 
        return;
      }

      try {
        debugger;
        const response = await axios.get('https://localhost:7294/api/configurations', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setConfigs(response.data);
        setLoading(false);
      } catch (error) {
        navigate('/login');
      }
    };

    fetchData();

    fetchConfigs();
  }, [navigate]);

  const handleAddConfig = async () => {
    debugger;

    if (buildingCost <= 0) {
      showError('Building cost must be a positive number.');
      return;
    }
    if (constructionTime < 30 || constructionTime > 1800) {
      showError('Construction time must be between 30 and 1800 seconds.');
      return;
    }
    if (!types.includes(buildingType)) {
      showError('Selected building type is not valid.');
      return;
    }

    const newConfig = { buildingType, buildingCost, constructionTime };
    try {
      await addConfiguration(newConfig);
      setConfigs([...configs, newConfig]);
      setAddedTypes([...addedTypes, buildingType]); 
      setBuildingType('');
      setBuildingCost('');
      setConstructionTime('');
      setOpen(false); 
      showSuccess('Configuration added successfully.');
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteConfig = async (id) => {
    try {
      debugger;
      await deleteConfiguration(id);

      const deletedConfig = configs.find(config => config.id === id);
    
      if (deletedConfig) {
      setAddedTypes(addedTypes.filter(type => type !== deletedConfig.buildingType));
      }

      setConfigs(configs.filter(config => config.id !== id));
      showSuccess('Configuration deleted successfully.');
    } catch (error) {
      console.error(error);
      showError('Failed to delete configuration.');
    }
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  const showError = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage('');
    }, 5000); 
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage('');
    }, 5000); 
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const columns = [
    { field: 'buildingType', headerName: 'Building Type', width: 350, headerClassName: 'header-style' },
    { field: 'buildingCost', headerName: 'Building Cost', width: 350 , headerClassName: 'header-style' },
    { field: 'constructionTime', headerName: 'Construction Time', width: 350 , headerClassName: 'header-style' },
    {
      field: '',
      headerName: '',
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <IconButton color='error' onClick={() => handleDeleteConfig(params.row.id)}>
          <Delete />
        </IconButton>
      ),
    },
  ];

  const rows = configs.map((config, index) => ({
    id: index+1, 
    ...config
  }));
  return (
    <Container>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Configuration
        </Typography>
        <Button variant="contained" color="primary" onClick={handleLogout} startIcon={<Logout />}>
          Logout
        </Button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <Button variant="contained" color="primary" onClick={handleClickOpen}>
          Add Configuration
        </Button>
      </div>
      <div style={{ height: 400, width: '100%', marginTop: '20px', backgroundColor: 'white' }}>
        <DataGrid sx={{borderRadius:2,boxShadow:3}} rows={rows} columns={columns} pageSize={5} />
      </div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Configuration</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Building Type"
            fullWidth
            margin="normal"
            value={buildingType}
            onChange={(e) => setBuildingType(e.target.value)}
          >
            {types.filter(type => !addedTypes.includes(type)).map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Building Cost"
            type="number"
            fullWidth
            margin="normal"
            value={buildingCost}
            onChange={(e) => setBuildingCost(e.target.value)}
          />
          <TextField
            label="Construction Time (seconds)"
            type="number"
            fullWidth
            margin="normal"
            value={constructionTime}
            onChange={(e) => setConstructionTime(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button variant="contained" onClick={handleAddConfig} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      {errorMessage && (
        <Snackbar open autoHideDuration={3000} onClose={() => setErrorMessage('')}>
          <Alert severity="error">{errorMessage}</Alert>
        </Snackbar>
      )}
      {successMessage && (
        <Snackbar open autoHideDuration={3000} onClose={() => setSuccessMessage('')}>
          <Alert severity="success">{successMessage}</Alert>
        </Snackbar>
      )}
    </Container>
  );
};

export default Configuration;




