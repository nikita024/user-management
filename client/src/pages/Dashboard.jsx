import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Piechart from "./Piechart";
import "../style.css";
import UserAvatar from "../components/UserAvatar";
import CountBox from "../components/CountBox";
import { useDispatch, useSelector } from "react-redux";
import { handleSessionTimeoutModal, validateToken } from "../redux/slices/authSlice";
import { fetchAllUsers } from "../redux/slices/userSlice";
import { fetchProfiles } from "../redux/slices/profileSlice";

const Dashboard = () => {
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

  const handleReportButtonClick = () => {
    navigate("/reports");
  };

  const ltdUsers = users.slice(0, 4);

  return (
    <div className="content-container">
      <div className="dashboard-container">
        <h1 style={{ textTransform: "capitalize" }}>Welcome, {currentUser?.username}</h1>
        
        <div className="count-container">
          <CountBox label="Total Users" count={usersCount} />
          <CountBox label="Admin Count" count={adminCount} />
          <CountBox label="Total Profiles" count={profilesCount} />
        </div>
        
        <div className="dashboard-content">
          <div className="pie-chart-container">
            {users && usersCount ? (
              <Piechart usersCount={usersCount} adminCount={adminCount} profileCount={profilesCount} />
            ) : null}
          </div>
          
          <div className="report-box">
            <h2>Reports</h2>
            <table>
              <thead>
                  <tr>
                      <th>ID</th>
                      <th>Username</th>
                      <th>Email</th>
                      <th>isAdmin</th>
                  </tr>
              </thead>
              <tbody>
                  {ltdUsers.map((user) => (
                      <tr key={user.id}>
                          <td>{user.id}</td>
                          <td>
                            <div style={{ display: "flex", alignItems: "center" }}>
                              <UserAvatar username={user.username} profilePicture={user.profilePicture} />
                              <span style={{ marginLeft: "10px" }}>{user.username}</span>
                            </div>
                          </td>
                          <td>{user.email}</td>
                          <td>{user.is_admin ? "Yes" : "No"}</td>
                      </tr>
                  ))}
              </tbody>
          </table>
          {currentUser?.is_admin ?
            <button className="report-button" onClick={handleReportButtonClick}>View Reports</button>
          :null}
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

export default Dashboard;
