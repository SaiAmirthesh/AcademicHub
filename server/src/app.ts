import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import departmentRoutes from "./routes/departmentRoutes";
import subjectRoutes from "./routes/subjectRoutes";
import classRoutes from "./routes/classRoutes";
import teacherRoutes from "./routes/teacherRoutes";
import studentRoutes from "./routes/studentRoutes";
import analyticsRoutes from "./routes/analyticsRoutes";
import securityMiddleware from './middleware/security';
import { authMiddleware } from './middleware/auth';
import { toNodeHandler } from 'better-auth/node';
import { auth } from "./lib/auth";

const app = express();
const PORT = 3000;

dotenv.config();


if(!process.env.FRONTEND_URL){
    throw new Error('FRONTEND_URL is not defined');
}

app.use(cors({
    origin:process.env.FRONTEND_URL,
    methods: ['GET','POST','PUT','DELETE'],
    credentials: true
}));

app.post('/api/auth/sign-up/email', (req, res) => {
    return res.status(403).json({
        success: false,
        data: null,
        error: "Public registration is disabled"
    });
});

app.all('/api/auth/*splat',toNodeHandler(auth))

app.use(express.json());

app.use(authMiddleware);

app.use(securityMiddleware);

app.use(`/api/departments`, departmentRoutes);
app.use(`/api/subjects`, subjectRoutes);
app.use(`/api/classes`, classRoutes);
app.use(`/api/teachers`, teacherRoutes);
app.use(`/api/students`, studentRoutes);
app.use(`/api/analytics`, analyticsRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});