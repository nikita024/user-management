import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { handleSessionTimeoutModal, validateToken } from "../redux/slices/authSlice";

const PageNotFound = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const { currentUser, showSessionTimeoutModal } = useSelector((state) => state.auth);

  useEffect(() => {
    const accessToken = localStorage.getItem("user");
    if (!currentUser && !accessToken) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    dispatch(validateToken());
  }, [dispatch]);

  return (
    <div className="content-container">
      <div className="dashboard-container">
        <h1 style={{ textTransform: "capitalize" }}>Page Not Found</h1>
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

export default PageNotFound;