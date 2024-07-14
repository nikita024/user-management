import express from "express";
import { 
    getAllProfiles, 
    getProfile,
    addProfile, 
    updateProfile,
} from "../controllers/profile.js";
import verifyToken from "../middleware/verifyToken.js";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });

const router = express.Router();

router.get("/", getAllProfiles);
router.get("/:id", getProfile);
router.post("/", verifyToken, upload.single("profile_pic"), addProfile);
router.put("/:id", verifyToken, upload.single("profile_pic"), updateProfile);


export default router;