import  { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Piechart from "./Piechart";
import HolidaysList from "./HolidaysList";
import CountBox from "../components/CountBox";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfiles } from "../redux/slices/profileSlice";
import { fetchAllUsers } from "../redux/slices/userSlice";
import { handleSessionTimeoutModal, validateToken } from "../redux/slices/authSlice";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const { currentUser, showSessionTimeoutModal } = useSelector((state) => state.auth);
  const { users, usersCount, adminCount } = useSelector((state) => state.users);
  const { profilesCount } = useSelector((state) => state.profile);

  useEffect(() => {
    dispatch(fetchProfiles());
    dispatch(fetchAllUsers());
    dispatch(validateToken());
  }, [ dispatch ]);

  useEffect(() => {
    const accessToken = localStorage.getItem("user");
    if (!currentUser && !accessToken) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  return (
    <div className="content-container">
      <div className="dashboard-container">
        <h1 style={{ textTransform: "capitalize" }}>Welcome, {currentUser?.username}</h1>
        <div className="count-container">
          <div className="count-box">
            <CountBox label="Total Users" count={usersCount} />
          </div>
          <div className="count-box">
            <CountBox label="Admin Count" count={adminCount} />
          </div>
          <div className="count-box">
            <CountBox label="Total Profiles" count={profilesCount} />
          </div>
        </div>

        <div className="dashboard-content">
          <div className="pie-chart-container">
            {users && usersCount ? <Piechart usersCount={usersCount} adminCount={adminCount} profileCount={profilesCount} /> : null}
          </div>
          <div className="holidays-box-container"> 
            <HolidaysList />
          </div>
        </div>
      </div>

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

export default Home;
