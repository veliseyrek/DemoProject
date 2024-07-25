import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/api';
import '../assets/register.css';
import { TextField, Button, Container, Typography, Box, CssBaseline, Paper, Snackbar, Alert } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState({ username: '', email: '', password: '', server: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setError({ username: '', email: '', password: '', server: '' });
    }, 5000);

    return () => clearTimeout(timer);
  }, [error]);

  const handleRegister = async (e) => {
    e.preventDefault();
    let hasError = false;
    const newError = { username: '', email: '', password: '', server: '' };

    if (!username) {
      newError.username = 'Username is required';
      hasError = true;
    }
    if (!email) {
      newError.email = 'Email is required';
      hasError = true;
    }
    if (!password) {
      newError.password = 'Password is required';
      hasError = true;
    }

    if (hasError) {
      setError(newError);
      return;
    }

    try {
      await register(username, email, password);
      setSuccessMessage('Registration successful!');
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      setError({ ...newError, server: 'Registration failed. Try a different username and e-mail address.' });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Paper elevation={3} style={{ padding: '20px', marginTop: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h5">Register</Typography>
          <Box component="form" noValidate sx={{ mt: 8 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={Boolean(error.username)}
              helperText={error.username}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={Boolean(error.email)}
              helperText={error.email}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={Boolean(error.password)}
              helperText={error.password}
            />
            {error.server && <Typography color="error">{error.server}</Typography>}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleRegister}
            >
              Register
            </Button>
            <Button
              fullWidth
              variant="text"
              color="secondary"
              onClick={() => navigate('/login')}
            >
              I already have an account
            </Button>
          </Box>
        </Paper>
      </Container>
      <Snackbar open={Boolean(successMessage)} autoHideDuration={3000} onClose={() => setSuccessMessage('')}>
        <Alert onClose={() => setSuccessMessage('')} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default Register;
