import db from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import atob from 'atob';
import { decodeBase65 } from "../utils/index.js";

export const register = (req, res) => {
  const q = "SELECT * FROM users WHERE email = ? ";

  if (!req.body.username) {
    return res.status(400).json("Username is required!");
  }
  if (!req.body.email) {
    return res.status(400).json("Email is required!");
  }
  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  if (!emailRegex.test(req.body.email)) {
      return res.status(400).json("Invalid email address!" );
  }
  if (!req.body.password) {
    return res.status(400).json("Password is required!");
  }

  if (req.body.password.length < 8 || req.body.password.length > 15) {
    return res.status(400).json("Password must be between 8 and 15 characters!");
  }

  const validPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
  if (!validPassword.test(req.body.password)) {
    return res.status(400).json("Password must contain at least one uppercase, one lowercase, one number and one special character!");
  }

  db.query(q, [req.body.email, req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length) return res.status(409).json("User already exists!");

    
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const q = "INSERT INTO users(`username`,`email`,`password`) VALUES (?)";
    const values = [req.body.username, req.body.email, hash];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("User has been created.");
    });
  });
};

export const login = (req, res) => {

  const q = "SELECT * FROM users WHERE email = ?";

  if (!req.body.email) {
    return res.status(400).json("Email is required!");
  }

  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  if (!emailRegex.test(req.body.email)) {
      return res.status(400).json("Invalid email address!");
  }

  if (!req.body.password) {
    return res.status(400).json("Password is required!");
  }

  db.query(q, [req.body.email], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("User not found!");
  
    // const decodedPassword = atob(req.body.password); // base64 decoding for password
    const decodedPassword = decodeBase65(req.body.password); // base65 decoding for password

    const isPasswordCorrect = bcrypt.compareSync(
      decodedPassword,
      data[0].password
    );

    if (!isPasswordCorrect)
      return res.status(400).json("Wrong username or password!");

    const token = jwt.sign({ id: data[0].id }, process.env.JWT_KEY, {
      expiresIn: "1d",
    });
    const { password, ...other } = data[0];

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
      sameSite: "none",
    })

    res.status(200).json({
      message : "Login successful",
      ...other,
    })
  });
}

export const logout = (req, res) => {
  res.clearCookie("token");
  return res.status(200).json("Logged out successfully!");
}

export const validateToken = (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json("Unauthorized");
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    return res.status(200).json(decoded);
  } catch (error) {
    return res.status(401).json("Invalid token");
  }
}

export const getAllUsers = (req, res) => {
  const q = "SELECT * FROM users";
  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
}


