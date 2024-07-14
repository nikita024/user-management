import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { apiURL } from '../../constants';

const initialState = {
  users: [],
  usersCount: 0,
  adminCount: 0, 
  loading: false,
  error: null,
  registerForm: {
    username: "",
    email: "",
    password: "",
  }
};

const userSlice = createSlice({
  name: 'users',
  initialState,

  reducers: {
    setRegisterFormInput: (state, action) => {
      state.registerForm[action.payload.name] = action.payload.value;
    },
    resetRegisterForm: (state) => {
      state.registerForm = initialState.registerForm;
    },
    fetchAllUsersPending: (state) => {
      state.loading = true;
    },
    fetchAllUsersFulfilled: (state, action) => {
      state.loading = false;
      state.users = action.payload;
    },
    fetchAllUsersRejected: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    registerUserPending: (state) => {
      state.loading = true;
    },


    registerUserFulfilled: (state) => {
      state.loading = false;
    },
    registerUserRejected: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    editUserPending: (state) => {
      state.loading = true;
    },
    editUserFulfilled: (state, action) => {
      state.loading = false;
      const index = state.users.findIndex((user) => user.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    },
    editUserRejected: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteUserPending: (state) => {
      state.loading = true;
    },
    deleteUserFulfilled: (state, action) => {
      state.loading = false;
      state.users = state.users.filter((user) => user.id !== action.payload);
    },
    deleteUserRejected: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setUsersCount: (state, action) => {
      state.usersCount = action.payload;
    },
    setAdminCount: (state, action) => {
      state.adminCount = action.payload;
    },
  },
});


export const fetchAllUsers = () => async (dispatch) => {
  dispatch(fetchAllUsersPending());
  try {
    const response = await axios.get(`${apiURL}users`);
    dispatch(fetchAllUsersFulfilled(response.data));
    dispatch(setUsersCount(response.data.length));
    const adminUsers = response.data.filter((user) => user.is_admin === 1);
    dispatch(setAdminCount(adminUsers.length));
  } catch (error) {
    dispatch(fetchAllUsersRejected(error.message));
  }
};

// export const registerUser = (formData) => async (dispatch) => {
//   dispatch(registerUserPending());
//   try {
//     await axios.post(`${apiURL}users/register`, formData);
//     dispatch(registerUserFulfilled());
//     return { success: true };
//   } catch (error) {
//     dispatch(registerUserRejected(error.message));
//     return { success: false, error: error };
//   }
// };
export const registerUser = () => async (dispatch, getState) => {
  const formData = getState().users.registerForm;
  dispatch(registerUserPending());
  try {
    const response = await axios.post(`${apiURL}users/register`, formData);
    dispatch(registerUserFulfilled(response.data));
    dispatch(resetRegisterForm());
    return { success: true };
  } catch (error) {
    dispatch(registerUserRejected(error.message));
    return { success: false, error: error };
  }
};

export const editUser = ({ id, formData }) => async (dispatch) => {
  dispatch(editUserPending());
  try {
    const response = await axios.put(`${apiURL}admin/users/${id}`, formData, {
      withCredentials: true,
    });
    dispatch(editUserFulfilled(response.data));
    return { success: true };
  } catch (error) {
    dispatch(editUserRejected(error.message));
    return { success: false, error: error };
  }
};


export const deleteUser = (id) => async (dispatch) => {
  dispatch(deleteUserPending());
  try {
    await axios.delete(`${apiURL}admin/users/${id}`, {
      withCredentials: true,
    });
    dispatch(deleteUserFulfilled(id));
    return { success: true };
  } catch (error) {
    dispatch(deleteUserRejected(error.message));
    return { success: false, error: error };
  }
};


export const {
  setRegisterFormInput, 
  resetRegisterForm,
  fetchAllUsersPending,
  fetchAllUsersFulfilled,
  fetchAllUsersRejected,
  registerUserPending,
  registerUserFulfilled,
  registerUserRejected,
  editUserPending,
  editUserFulfilled,
  editUserRejected,
  deleteUserPending,
  deleteUserFulfilled,
  deleteUserRejected,
  setUsersCount,
  setAdminCount 
} = userSlice.actions;

export default userSlice.reducer;






