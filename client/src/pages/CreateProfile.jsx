import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ImageCropper from '../components/ImageCropper';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfiles, createProfile, setPreviewImage, setCroppingImage, setProfileData } from '../redux/slices/profileSlice';
import { handleSessionTimeoutModal, logout, validateToken } from '../redux/slices/authSlice';

const CreateProfile = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const { currentUser, showSessionTimeoutModal } = useSelector((state) => state.auth);
  const { profileData, previewImage, croppingImage } = useSelector((state) => state.profile);
  const [profileId, setProfileId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(setProfileData({ ...profileData, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    // setProfileData({ ...profileData, profile_pic: file });
    dispatch(setPreviewImage(URL.createObjectURL(file)));
    dispatch(setCroppingImage(true));
  };

  const handleCropComplete = async (croppedImageBlob) => {
    try {
        
        const response = await fetch(croppedImageBlob);
        const blobData = await response.blob();

        const uniqueId = uuidv4();
        const fileExtension = croppedImageBlob.split('.').pop();
        const uniqueFileName = `${uniqueId}.${fileExtension}`;
       
        const binaryDataBlob = new File([blobData], uniqueFileName, { type: 'image/jpeg' });
        dispatch(setProfileData({ ...profileData, profile_pic: binaryDataBlob }));
        dispatch(setPreviewImage(URL.createObjectURL(binaryDataBlob)));
        dispatch(setCroppingImage(false));
    } catch (error) {
        console.error('Error handling cropped image:', error);
    }
  };

  const handleCropCancel = () => {
    dispatch(setCroppingImage(false));
    dispatch(setPreviewImage(null));
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleCreateProfile = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(createProfile({ profileData}));
    if (resultAction.success) {
      navigate(`/profile/${resultAction.payload.data.id}`);
      toast.success('Profile created successfully!');
      dispatch(setPreviewImage(null));
    } else {
      toast.error(resultAction.payload || 'Error updating profile');
      if (resultAction.payload === 'Authentication error. Please login again.') {
        alert('Authentication error. Please login again.');
        dispatch(logout());
      }
    }
  };
  

  useEffect(() => {
    const fetchProfileDataAndSetId = async () => {
      const profiles = await dispatch(fetchProfiles());
      setProfileId(profiles?.payload[0]?.id);
    };
    
    fetchProfileDataAndSetId();
  }, [currentUser?.id, dispatch]);

  useEffect(() => {
    if (profileId !== null && profileId !== undefined) {
      navigate(`/profile/${profileId}`);
    } else {
      navigate('/profile/create');
    }
  }, [profileId, navigate]);

  useEffect(() => {
    dispatch(validateToken());
  }, [dispatch]);

  return (
    <div className='content-container'>
      <div className="profile-container">
        <div className="profile-form-container">
          <h1>Create Profile</h1>

          <div className="profile-form-card">
            <form>
              <div className="form-group">
                <label htmlFor="profile_pic">Profile Picture:</label>
                <div className="form-group-horizontal">
                  <input
                    type="file"
                    id="profile_pic"
                    name="profile_pic"
                    onChange={handleImageChange}
                    ref={fileInputRef}
                  />
                  <div className="profile-preview-container">
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Selected Profile"
                        className="profile-preview"
                        width={100}
                        height={100}
                      />
                    ) : null}
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone:<span className="required">*</span></label>
                <input
                  type="number"
                  id="phone"
                  name='phone'
                  value={profileData.phone || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="dob">Date of Birth:<span className="required">*</span></label>
                <input
                  type="date"
                  id="dob"
                  name='dob'
                  value={profileData.dob || ""}
                  onChange={handleChange}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="form-group">
                <label htmlFor="city">City:</label>
                <input
                  type="text"
                  id="city"
                  name='city'
                  value={profileData.city}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="about">About:</label>
                <textarea
                  name="about"
                  value={profileData.about}
                  onChange={handleChange}
                  rows={5}
                />
              </div>
              <button type="submit" onClick={handleCreateProfile}>Create</button>
            </form>

          </div>
        </div>
      </div>

      {croppingImage && (
        <ImageCropper 
          previewImage={previewImage}
          onCropComplete={handleCropComplete}
          handleCropCancel={handleCropCancel} 
        />
      )}
      
      <ToastContainer />

      {showSessionTimeoutModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Session Timeout</h2>
            <p>Your session has timed out. Please log in again.</p>
            <button onClick={() => dispatch(handleSessionTimeoutModal())}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateProfile;
