import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, CssBaseline } from '@mui/material';
import { login } from '../services/api'; 
import { AccountCircle, Lock, Login as LoginIcon } from '@mui/icons-material';
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // useEffect kullanarak error state'ine göre inputları temizle
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
        setUsername('');
        setPassword('');
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Formun varsayılan davranışını önleyin

    if (!username || !password) {
      setError('Username and password are required');
      return;
    }

    try {
      debugger;
      const response = await login(username, password);
      localStorage.setItem('token', response.token);
      navigate('/configuration'); // Başarılı girişten sonra yönlendir
    } catch (error) {
      setError('Login failed. Please check your credentials.');
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/register');
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: 10,
          borderRadius: 2,
          boxShadow: 3,
          padding: 3,
          backgroundColor: '#f0f0f0', 
          width: '400px', 
          height: '400px', 
        }}
      >
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ mt: 1 }}
        >
          <TextField
            margin="normal"
            fullWidth
            id="username"
            label="Username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            autoFocus
            error={Boolean(error)}
            helperText={error.username}
          />
          <TextField
            margin="normal"
            fullWidth
            id="password"
            label="Password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            error={Boolean(error)}
            helperText={error.password}
          />
           {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 5, mx:2 }}>
            <Button
              type="submit"
              variant="contained"
              sx={{
                borderRadius: '50px',
                transition: 'background-color 0.3s',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              }}
              startIcon={<LoginIcon />}
            >
              Login
            </Button>
            <Button
              variant="contained"
              onClick={handleRegisterRedirect}
              sx={{
                borderRadius: '50px',
                backgroundColor: '#e0e0e0', // Açık renk
                color: '#000', // Metin rengi
                transition: 'background-color 0.3s',
                '&:hover': {
                  backgroundColor: '#d0d0d0',
                },
              }}
              startIcon={<AssignmentIndOutlinedIcon />}
            >
              Sign up
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;

