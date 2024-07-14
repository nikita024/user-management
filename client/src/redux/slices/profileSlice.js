import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { formatDate } from '../../utils';
import { apiURL } from '../../constants';


const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    profileData: {
      phone: '',
      dob: '',
      city: '',
      about: '',
      profile_pic: '',
    },
    profilesCount: 0,
    profilePic: null,
    previewImage: null,
    croppingImage: false,
    loading: false,
    error: null,
  },

  reducers: {
    fetchProfilesPending: (state) => {
      state.loading = true;
    },
    fetchProfilesFulfilled: (state, action) => {
      state.loading = false;
      if (action.payload.length > 0) {
        state.profileData.id = action.payload[0].id;
      }
    },
    fetchProfilesRejected: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchProfileDataPending: (state) => {
      state.loading = true;
    },
    fetchProfileDataFulfilled: (state, action) => {
      state.loading = false;
      state.profileData = action.payload;
      state.profilePic = action.payload.profile_pic;
    },
    fetchProfileDataRejected: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    createProfilePending: (state) => {
      state.loading = true;
    },
    createProfileFulfilled: (state, action) => {
      state.loading = false;
      state.profileData = action.payload;
    },
    createProfileRejected: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateProfilePending: (state) => {
      state.loading = true;
    },
    updateProfileFulfilled: (state, action) => {
      state.loading = false;
      state.profileData = action.payload;
      state.profilePic = action.payload.profile_pic;
      state.previewImage = null;
    },
    updateProfileRejected: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.profilePic = null;
    },
    setPreviewImage: (state, action) => {
      state.previewImage = action.payload;
    },
    setCroppingImage: (state, action) => {
      state.croppingImage = action.payload;
    },
    setProfilePic: (state, action) => {
      state.profilePic = action.payload;
    },
    setProfileData: (state, action) => {
      state.profileData = action.payload;
    },
    setProfilesCount: (state, action) => {
      state.profilesCount = action.payload;
    }
  },
});


export const fetchProfiles = () => async (dispatch, getState) => {
  dispatch(fetchProfilesPending());
  try {
    const { currentUser } = getState().auth;
    const response = await axios.get(`${apiURL}profile`);
    dispatch(setProfilesCount(response.data.length));
    const filteredProfiles = response.data.filter(profile => profile.uid === currentUser?.id);
    dispatch(fetchProfilesFulfilled(filteredProfiles));
    return { success: true, payload: filteredProfiles };
  } catch (error) {
    dispatch(fetchProfilesRejected(error.message));
  }
};

export const fetchProfileData = (profileId) => async (dispatch) => {
  dispatch(fetchProfileDataPending());
  try {
    const response = await axios.get(`${apiURL}profile/${profileId}`);
    response.data.dob = formatDate(response.data.dob);
    dispatch(fetchProfileDataFulfilled(response.data));
  } catch (error) {
    dispatch(fetchProfileDataRejected(error.message));
  }
};

export const createProfile = ({ profileData }) => async (dispatch) => {
  dispatch(createProfilePending());
  try {
    const formData = new FormData();
    for (const key in profileData) {
      formData.append(key, profileData[key]);
    }

    const response = await axios.post(`${apiURL}profile`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    });
    const createdProfile = response.data;
    dispatch(createProfileFulfilled(createdProfile)); 
    return { success: true, payload: createdProfile };
  } catch (error) {
    if (error.response && error.response.status === 401) {
      dispatch(createProfileRejected('Authentication error. Please login again.'));
      return { success: false, payload: 'Authentication error. Please login again.' };
    } else if (error.response && error.response.status === 400) {
      dispatch(createProfileRejected(error.response.data.error));
      return { success: false, payload: error.response.data.error };
    } else {
      dispatch(createProfileRejected('An error occurred while creating the profile.'));
      return { success: false, payload: 'An error occurred while creating the profile.' };
    }
  }
};

export const updateProfile = ({ profileId, profileData }) => async (dispatch) => {
  dispatch(updateProfilePending());
  try {
    const formData = new FormData();
    for (const key in profileData) {
      formData.append(key, profileData[key]);
    }

    const response = await axios.put(`${apiURL}profile/${profileId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    });
    const updatedProfile = response.data;
    dispatch(updateProfileFulfilled(updatedProfile)); 
    return { success: true, payload: updatedProfile };
  } catch (error) {
    if (error.response && error.response.status === 401) {
      dispatch(updateProfileRejected('Authentication error. Please login again.'));
      return { success: false, payload: 'Authentication error. Please login again.' };
    } else if (error.response && error.response.status === 400) {
      dispatch(updateProfileRejected(error.response.data.error));
      return { success: false, payload: error.response.data.error };
    } else {
      dispatch(updateProfileRejected('An error occurred while updating the profile.'));
      return { success: false, payload: 'An error occurred while updating the profile.' };
    }
  }
};

export const {
  fetchProfilesPending,
  fetchProfilesFulfilled,
  fetchProfilesRejected,
  fetchProfileDataPending,
  fetchProfileDataFulfilled,
  fetchProfileDataRejected,
  createProfilePending,
  createProfileFulfilled,
  createProfileRejected,
  updateProfilePending,
  updateProfileFulfilled,
  updateProfileRejected,
  setPreviewImage,
  setCroppingImage,
  setProfilePic,
  setProfileData,
  setProfilesCount,
} = profileSlice.actions;

export default profileSlice.reducer;










