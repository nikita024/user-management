import db from "../db.js";

export const getAllProfiles = (req, res) => {
    const q = "SELECT * FROM profiles";
    db.query(q, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    });
};

export const getProfile = (req, res) => {
    const q =
      "SELECT p.id, `username`, `email`, `phone`, `dob`, `city`, `about`, `uid`, `profile_pic` FROM users u JOIN profiles p ON u.id = p.uid WHERE p.id = ? ";
  
    db.query(q, [req.params.id], (err, data) => {
      if (err) return res.status(500).json(err);
  
      return res.status(200).json(data[0]);
    });
};

export const addProfile = (req, res) => {
    const userId = req.userId;
    const { phone, dob, city, about } = req.body;
    const profile_pic = req.file ? req.file.filename : null;

    const q =
    "INSERT INTO profiles(`phone`, `dob`, `city`, `about`, `profile_pic`, `uid`) VALUES (?, ?, ?, ?, ?, ?)";

    const values = [phone, dob, city, about, profile_pic, userId];

    if (!phone) {
        return res.status(400).json({ error: "Phone number is required!" });
    }

    if (!dob) {
        return res.status(400).json({ error: "Date of birth is required!" });
    }


    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
        return res.status(400).json({ error: "Invalid phone number format!" });
    }
   
    const currentDate = new Date();
    const dobDate = new Date(dob);
    if (dobDate > currentDate) {
        return res.status(400).json({ error: "Date of birth cannot be in the future!" });
    }

    db.query(q, values, (err, data) => {
        if (err) return res.status(500).json(err);
        const profileId = data.insertId;
        const fetchQuery = "SELECT * FROM profiles WHERE id = ?";
        db.query(fetchQuery, [profileId], (fetchErr, fetchData) => {
            if (fetchErr) return res.status(500).json(fetchErr);
            const createdProfile = fetchData[0];
            return res.json({
                data: createdProfile,
                message: "Profile has been created.",
            });
        });
    });
};

export const updateProfile = (req, res) => {
    const userId = req.userId;
    const profileId = req.params.id;
    const { email, phone, dob, city, about } = req.body;
    let profile_pic = null;

    if (req.file) {
        profile_pic = req.file.filename;
    }

    const q = "UPDATE profiles p JOIN users u ON p.uid = u.id SET u.email=?, p.phone=?, p.dob=?, p.city=?, p.about=? " + (profile_pic ? ", p.profile_pic=?" : "") + " WHERE p.id = ? AND p.uid = ?";

    const values = [email, phone, dob, city, about];

    if (profile_pic) {
        values.push(profile_pic);
    }
    
    values.push(profileId, userId);

    if (!phone) {
        return res.status(400).json({ error: "Phone number is required!" });
    }

    if (!dob) {
        return res.status(400).json({ error: "Date of birth is required!" });
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
        return res.status(400).json({ error: "Invalid phone number format!" });
    }

    const currentDate = new Date();
    const dobDate = new Date(dob);
    if (dobDate > currentDate) {
        return res.status(400).json({ error: "Date of birth cannot be in the future!" });
    }

    const checkEmailQuery = "SELECT * FROM users WHERE email = ?";
    db.query(checkEmailQuery, [email], (err, emailData) => {
        if (err) {
            return res.status(500).json(err);
        }
        const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json("Invalid email address!");
        }
        if (emailData.length > 0 && emailData[0].id !== userId) {
            return res.status(400).json({error: "Email already exists!"});
        }

        db.query(q, values, (err, data) => {
            if (err) return res.status(500).json(err);

            const fetchQuery = "SELECT * FROM profiles WHERE id = ?";
            db.query(fetchQuery, [profileId], (fetchErr, fetchData) => {
                if (fetchErr) return res.status(500).json(fetchErr);
                const updatedProfile = fetchData[0];
                return res.json({
                    data: updatedProfile,
                    message: "Profile has been updated.",
                });
            });
        });
    });
};