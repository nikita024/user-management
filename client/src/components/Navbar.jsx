import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LogoN from "../assets/image/N.png";
import { useNavigate } from "react-router-dom";
import "../style.css";
import UserAvatar from "./UserAvatar";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfiles } from "../redux/slices/profileSlice";
import { logout, validateToken } from "../redux/slices/authSlice";

const Navbar = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const { currentUser } = useSelector((state) => state.auth);
  const [profileId, setProfileId] = useState(null);

  useEffect(() => {
    const fetchProfileDataAndSetId = async () => {
      const profiles = await dispatch(fetchProfiles());
      setProfileId(profiles?.payload[0]?.id);
    };
    
    fetchProfileDataAndSetId();
  }, [currentUser?.id, dispatch]);

  const openDropdown = () => {
    setShowDropdown(true);
  };

  const closeDropdown = () => {
    setShowDropdown(false);
  };

  useEffect(() => {
    console.log("currentUser: ", currentUser);
    const user = localStorage.getItem("user");
    
     if (!currentUser && !user) {
      dispatch(logout());
      navigate("/login");
    }
  }, [currentUser, navigate, dispatch]);

  useEffect(() => {
    dispatch(validateToken());
  }, [dispatch]);

  return (
    <div className="navbar">
      <div className="logo">
        <Link to="/dashboard">
          <img src={LogoN} alt="" />
        </Link>
      </div>
      <div className="links">
        <Link className="link" to="/dashboard">
          <h6>Home</h6>
        </Link>
        <Link className="link" to="/contact">
          <h6>Contacts</h6>
        </Link>
        {currentUser ? (
          <div className="dropdown">
            <div className="dropbtn" onMouseEnter={openDropdown} onMouseLeave={closeDropdown}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <UserAvatar username={currentUser?.username} profilePicture={currentUser?.profilePicture} width={40} height={40} />
                <span style={{color: 'blue', textTransform: 'capitalize'}}>{currentUser?.username}</span> &#9660;
              </div>
            </div>
            {showDropdown && (
              <div className="dropdown-content" onMouseEnter={openDropdown} onMouseLeave={closeDropdown}>
                <Link to={`/profile/${profileId}`} >
                  <li className="dropdown-item">
                    Profile
                  </li>
                </Link>
                <Link onClick={() => dispatch(logout())}>
                  <li className="dropdown-item">
                    Logout
                  </li>
                </Link>
              </div>
            )}
          </div>
        ) : (
          <Link className="login-link" to="/login">
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
