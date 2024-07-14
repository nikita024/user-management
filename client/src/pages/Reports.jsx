import  { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import Loader from "../components/Loader";
import UserAvatar from "../components/UserAvatar";
import 'react-toastify/dist/ReactToastify.css';
import { Edit24Regular, Delete24Regular  } from "@fluentui/react-icons"
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, editUser, fetchAllUsers } from "../redux/slices/userSlice";
import { logout, validateToken, handleSessionTimeoutModal } from "../redux/slices/authSlice";

const Reports = () => {
  
  const navigate = useNavigate(); 
  const dispatch = useDispatch();

  const { currentUser, showSessionTimeoutModal } = useSelector((state) => state.auth);
  const { users, loading } = useSelector((state) => state.users);

  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState({ username: "", email: "", is_admin: 0 });

  const handleEdit = (user) => {
    setIsModalOpen(true);
    setSelectedUser(user);
    setFormData({ username: user.username, email: user.email, is_admin: user.is_admin ? 1 : 0 }); 
  }

  const handleDelete = (user) => {
    setIsDeleteModalOpen(true);
    setSelectedUser(user)
  }

  const handleChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked ? 1 : 0 : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  }

  const handleEditUser = async (e) => {
    e.preventDefault();
    const result = await dispatch(editUser({ id: selectedUser?.id, formData }));
  
    if (result.success) {
      setIsModalOpen(false);
      toast.success("User updated successfully");
      dispatch(fetchAllUsers());
    } else {
      if (result.error.response && result.error.response.status === 401) {
        alert('Authentication error. Please login again.');
        dispatch(logout());
      } else {
        toast.error(result.error.response.data);
      }
    }
  };

  const handleDeleteUser = async (e) => {
    e.preventDefault();
    const result = await dispatch(deleteUser(selectedUser.id));
      
    if (result.success) {
      setIsDeleteModalOpen(false);
      toast.success("User deleted successfully");
      dispatch(fetchAllUsers());
    } else {
      if (result.error.response && result.error.response.status === 401) {
        alert('Authentication error. Please login again.');
        dispatch(logout());
      } else {
        toast.error(result.error.response.data);
      }
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("user");
    if (!currentUser && !accessToken) {
      navigate("/login");
    } else if (!currentUser?.is_admin) {
      navigate("/dashboard");
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    dispatch(fetchAllUsers());
    dispatch(validateToken());
  }, [dispatch]);

  return (
    <div className="content-container">
      {loading ? (
        <Loader />
      ) : (
        <div className="dashboard-container">
          <h1 style={{ textTransform: "capitalize" }}>Reports</h1>
          <table>
              <thead>
                  <tr>
                      <th>ID</th>
                      <th>Username</th>
                      <th>Email</th>
                      <th>isAdmin</th>
                      <th>Actions</th>
                  </tr>
              </thead>
              <tbody>
                  {users.map((user) => (
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
                          <td className="actions">
                          <Edit24Regular 
                            style={{ 
                              marginRight: "5px", 
                              verticalAlign: "middle", 
                              cursor: "pointer", 
                              backgroundColor: "blue", 
                              color: "white", 
                              padding: "5px", 
                              borderRadius: "5px", 
                            }} 
                            onClick={() => handleEdit(user)}
                          />
                          <Delete24Regular 
                            style={{ 
                              marginRight: "5px", 
                              verticalAlign: "middle", 
                              cursor: "pointer", 
                              backgroundColor: "red", 
                              color: "white", 
                              padding: "5px", 
                              borderRadius: "5px" 
                            }} 
                            onClick={() => handleDelete(user)} 
                          />
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
          {isModalOpen && (
            <div className="modal">
              <div className="modal-content">
                <span className="close" onClick={() => setIsModalOpen(false)}>
                  &times;
                </span>
                <h2>Edit User</h2>
                <form onSubmit={handleEditUser}>
                  <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} style={{ width: "95%"}} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: "95%"}} />
                  </div>
                  {currentUser?.id === selectedUser?.id && currentUser?.is_admin === 1 ? (
                    <div className="form-group checkbox-group">
                      <label htmlFor="is_admin">Is Admin:</label>
                      <input 
                        type="checkbox" 
                        id="is_admin" 
                        name="is_admin" 
                        checked={formData.is_admin === 1} 
                        onChange={handleChange} 
                        disabled
                      />
                    </div>
                  ) : (
                    <div className="form-group checkbox-group">
                      <label htmlFor="is_admin">Is Admin:</label>
                      <input 
                        type="checkbox" 
                        id="is_admin" 
                        name="is_admin" 
                        checked={formData.is_admin === 1} 
                        onChange={handleChange} 
                      />
                    </div>
                  )}
                  <div className="btn-container">
                    <button type="button" onClick={() => setIsModalOpen(false)}>Cancel</button>
                    <button type="submit">Save Changes</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {isDeleteModalOpen && (
            <div className="modal">
              <div className="modal-content">
                <span className="close" onClick={() => setIsDeleteModalOpen(false)}>
                  &times;
                </span>
                <h2>Delete User</h2>
                <p>Are you sure you want to delete this user?</p>
                <div className="btn-container">
                  <button onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
                  {currentUser?.id === selectedUser?.id && currentUser?.is_admin === 1 ? (
                    <button className="disabled" onClick={handleDeleteUser} disabled>Delete</button>
                  ) : (
                    <button onClick={handleDeleteUser}>Delete</button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )} 

    {showSessionTimeoutModal && (
      <div className="modal">
        <div className="modal-content">
          <h2>Session Timeout</h2>
          <p>Your session has timed out. Please log in again.</p>
          <button onClick={() => dispatch(handleSessionTimeoutModal())}>OK</button>
        </div>
      </div>
    )}

      <ToastContainer />
    </div>
  );
};

export default Reports;
