import db from "../db.js";

export const updateUser = (req, res) => {
  const userId = req.params.userId;
  const { email, username, is_admin } = req.body;

  if (!userId) {
    return res.status(400).json("User ID is required!");
  }

  if (!email && !username && is_admin === undefined) {
    return res.status(400).json("At least one field (email, username, or is_admin) is required to update!");
  }

  if (email) {
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json("Invalid email address!");
    }
  }

  const getUserQuery = "SELECT * FROM users WHERE id = ?";
  db.query(getUserQuery, [userId], (err, userData) => {
    if (err) {
      return res.status(500).json(err);
    }
    if (userData.length === 0) {
      return res.status(404).json("User not found!");
    }

    if (email && email !== userData[0].email) {
      const checkEmailQuery = "SELECT * FROM users WHERE email = ?";
      db.query(checkEmailQuery, [email], (err, emailData) => {
        if (err) {
          return res.status(500).json(err);
        }
        if (emailData.length > 0 && emailData[0].id !== userId) {
          return res.status(400).json("Email already exists!");
        }
        
        updateUserFields();
      });
    } else {
    
      updateUserFields();
    }
  });

  function updateUserFields() {
    let updateFields = [];
    let queryParams = [];
    if (email) {
      updateFields.push("email = ?");
      queryParams.push(email);
    }
    if (username !== undefined) {
      updateFields.push("username = ?");
      queryParams.push(username);
    }
    if (is_admin !== undefined) {
      updateFields.push("is_admin = ?");
      queryParams.push(is_admin);
    }
    queryParams.push(userId);

    const updateQuery = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
    db.query(updateQuery, queryParams, (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }
      if (result.affectedRows === 0) {
        return res.status(500).json("Failed to update user information!");
      }
      return res.status(200).json("User information updated successfully!");
    });
  }
};




export const deleteUser = (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json("User ID is required!");
  }

  const getUserQuery = "SELECT * FROM users WHERE id = ?";
  db.query(getUserQuery, [userId], (err, userData) => {
    if (err) {
      return res.status(500).json(err);
    }
    if (userData.length === 0) {
      return res.status(404).json("User not found!");
    }
  });

  const deleteQuery = "DELETE FROM users WHERE id = ?";
  db.query(deleteQuery, [userId], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }
    if (result.affectedRows === 0) {
      return res.status(500).json("Failed to delete user!");
    }
    return res.status(200).json("User deleted successfully!");
  })
}


