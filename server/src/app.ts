import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import departmentRoutes from "./routes/departmentRoutes";
import subjectRoutes from "./routes/subjectRoutes";
import classRoutes from "./routes/classRoutes";

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

app.use(express.json());

const API_VERSION = 'v1';
app.use(`/api/${API_VERSION}/departments`, departmentRoutes);
app.use(`/api/${API_VERSION}/subjects`, subjectRoutes);
app.use(`/api/${API_VERSION}/classes`, classRoutes);

app.listen(PORT, () => {
    console.log(`Servers is running on port ${PORT}`);
});