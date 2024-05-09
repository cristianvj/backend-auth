import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
//import morgan from 'morgan';
import { connectDB } from './config/db';
import authRouter from './routes/authRoutes';
import { corsConfig } from './config/cors';

dotenv.config();
connectDB();

const app = express();
app.use(cors(corsConfig));

//Logging
//app.use(morgan('dev'))

// Leer datos de formularios
app.use(express.json())

// Routes
app.use('/api/auth', authRouter);

export default app;