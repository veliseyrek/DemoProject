import axios from 'axios';

const API_URL = 'https://localhost:7294/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

export const login = async (username, password) => {
    debugger;
  try {
    const response = await api.post('/login', { username, password });

    if (response.data && response.data.token) {
      return response.data;
    } else {
      throw new Error('No token received');
    }
    //return response.data;
  } catch (error) {
    throw error;
  }
};

export const register = async (username, email, password) => {
  try {
    const response = await api.post('/register', { username, email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getConfigurations = async () => {
  try {
    const response = await api.get('/configurations');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addConfiguration = async (config) => {
  try {
    const response = await api.post('/configurations', config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteConfiguration = async (id) => {
  try {
    const response = await api.delete(`/configurations/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

