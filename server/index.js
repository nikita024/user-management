import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import userRoutes from './routes/user.js';
import profileRoutes from './routes/profile.js';
import adminRoutes from './routes/admin.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();
const app = express();
const port = process.env.PORT || 8080;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:5173', 'https://nikita-ums.netlify.app'],
  credentials: true
}));

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(join(__dirname, 'uploads')));

app.use("/api/users", userRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/admin/users", adminRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
