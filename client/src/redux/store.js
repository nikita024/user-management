import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import authReducer from './slices/authSlice';
import profileReducer from './slices/profileSlice';

const store = configureStore({
  reducer: {
    users: userReducer,
    auth: authReducer,
    profile: profileReducer,
  },
});

export default store;
