import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchProfiles, fetchProfileData, updateProfile, setPreviewImage, setCroppingImage, setProfilePic, setProfileData } from '../redux/slices/profileSlice';
import Loader from '../components/Loader';
import UserAvatar from '../components/UserAvatar';
import ImageCropper from '../components/ImageCropper';
import { v4 as uuidv4 } from 'uuid';
import { handleSessionTimeoutModal, logout, validateToken } from '../redux/slices/authSlice';
import { uploadURL } from '../constants';

const Profile = () => {

  const { profileId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const { currentUser, showSessionTimeoutModal } = useSelector((state) => state.auth);
  const { profileData, profilePic, previewImage, croppingImage, loading } = useSelector((state) => state.profile);


  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(setProfileData({ ...profileData, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
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

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const profileUpdateData = { profileId, profileData };
    const resultAction = await dispatch(updateProfile(profileUpdateData));
    console.log(resultAction);
    if (resultAction.success) {
      alert('Profile Updated Successfully');
      // toast.success('Profile updated successfully');
      dispatch(setProfilePic(profileData.profile_pic));
      dispatch(fetchProfileData(profileId));
    } else {
      toast.error(resultAction.payload || 'Error updating profile');
      if (resultAction.payload === 'Authentication error. Please login again.') {
        alert('Authentication error. Please login again.');
        dispatch(logout());
      }
    }
  };

  useEffect(() => {
    dispatch(fetchProfiles());
  }, [dispatch]);

  useEffect(() => {
    if (!profileData.id) {
      navigate("/profile/create");
    } else {
      navigate(`/profile/${profileData.id}`);
    }
  }, [profileData.id, navigate]);

  useEffect(() => {
    if (currentUser && profileId) {
      dispatch(fetchProfileData(profileId));
    }
  }, [currentUser, profileId, dispatch]);

  useEffect(() => {
    dispatch(validateToken());
  }, [ dispatch ]);

  return (
    <div className='content-container'>
      {loading && <Loader />}
      {!loading && (
        <div className="profile-container">
          <div className="profile-form-container">
            <h1>Profile</h1>
            <h3>Hii <span style={{ color: 'blue', textTransform: 'capitalize' }}>{currentUser?.username}</span>, Update your profile</h3>

            <div className="profile-form-card">
              <form>
                <div className="form-group">
                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profileData?.email ? profileData?.email : currentUser?.email}
                    placeholder="Enter your email"
                    onChange={handleChange}
                  />
                </div>
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
                    type="text"
                    id="phone"
                    name='phone'
                    value={profileData.phone || ""}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="dob">Date of Birth: <span className="required">*</span></label>
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
                <button type="submit" onClick={handleUpdateProfile}>Update</button>
              </form>
            </div>
          </div>
          <div className="profile-image-container">
            {profilePic ? (
              <img
                src={typeof profilePic === 'string' ? `${uploadURL}uploads/${profilePic}` : URL.createObjectURL(profilePic)}
                alt="Profile Picture"
                className='profile-image'
                width={200}
                height={200}
              />
            ) : (
              <div className="no-image">
                <UserAvatar username={currentUser?.username} width={200} height={200} />
              </div>
            )}
          </div>
        </div>
      )}
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
};

export default Profile;


