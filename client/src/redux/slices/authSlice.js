// redux/slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { apiURL } from '../../constants';

const initialState = {
  currentUser: JSON.parse(localStorage.getItem("user")) || null,
  showSessionTimeoutModal: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    setShowSessionTimeoutModal: (state, action) => {
      state.showSessionTimeoutModal = action.payload;
    },
    authPending: (state) => {
      state.loading = true;
      state.error = null;
    },
    authFulfilled: (state, action) => {
      state.loading = false;
      state.currentUser = action.payload;
    },
    authRejected: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  setCurrentUser,
  setShowSessionTimeoutModal,
  authPending,
  authFulfilled,
  authRejected,
} = authSlice.actions;

export const login = (inputs) => async (dispatch) => {
  dispatch(authPending());
  try {
    const res = await axios.post(`${apiURL}users/login`, inputs, {
      withCredentials: true,
    });
    localStorage.setItem("user", JSON.stringify(res.data));
    dispatch(authFulfilled(res.data));
  } catch (error) {
    dispatch(authRejected(error.message));
    throw error;
  }
};

export const logout = () => async (dispatch) => {
  try {
    await axios.get(`${apiURL}users/logout`, {
      withCredentials: true,
    });
    localStorage.removeItem("user");
    localStorage.setItem("logout", Date.now().toString());
    dispatch(setCurrentUser(null));
  } catch (error) {
    console.error("Logout error:", error);
  }
};

export const validateToken = () => async (dispatch) => {
  try {
    const res = await axios.get(`${apiURL}users/validateToken`, {
      withCredentials: true,
    });
    if (res) {
      dispatch(setShowSessionTimeoutModal(false));
      console.log(res);
    }
  } catch (error) {
    console.error("Token validation failed:", error);
    dispatch(setShowSessionTimeoutModal(true));
  }
};

export const handleSessionTimeoutModal = () => (dispatch) => {
  dispatch(setShowSessionTimeoutModal(false));
  dispatch(logout());
};

export default authSlice.reducer;
