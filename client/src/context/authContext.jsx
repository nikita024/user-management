import axios from "axios";
import { createContext, useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { apiURL } from "../constants";


export const AuthContext = createContext();

export const AuthContexProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [showSessionTimeoutModal, setShowSessionTimeoutModal] = useState(false);


  useEffect(() => {
    const onStorageChange = (e) => {
      if (e.key === "user") {
        setCurrentUser(JSON.parse(e.newValue));
      } else if (e.key === "logout") {
        setCurrentUser(null);
      }
    };

    window.addEventListener("storage", onStorageChange);

    return () => {
      window.removeEventListener("storage", onStorageChange);
    };
  }, []);




  const login = async (inputs) => {
    try { 


      const res = await axios.post(`${apiURL}users/login`, inputs, {
        withCredentials: true
      });
      localStorage.setItem("user", JSON.stringify(res.data));
      setCurrentUser(res.data);
      return res.data; 
    } catch (error) {
      console.error("Login error:", error); 
      throw error; 
    }
  };

  const logout = async () => {
    try {
      await axios.get(`${apiURL}users/logout`, {
        withCredentials: true
      });
      localStorage.removeItem("user");
      localStorage.setItem("logout", Date.now().toString());
      setCurrentUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

const validateToken = async () => {
    try {
      const res = await axios.get(`${apiURL}users/validateToken`, {
        withCredentials: true,
      });
      if (res) {
        setShowSessionTimeoutModal(false);
        console.log(res);
      }
    } catch (error) {
      console.error("Token validation failed:", error);
      setShowSessionTimeoutModal(true);
    }
  };

  const handleSessionTimeoutModal = () => {
    setShowSessionTimeoutModal(false);
    logout();
  };

 
  useEffect(() => {
    validateToken();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      showSessionTimeoutModal, 
      login, 
      logout, 
      validateToken, 
      handleSessionTimeoutModal
    }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthContexProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
