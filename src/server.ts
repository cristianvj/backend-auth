import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import swaggerUI from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import path from 'path';
import morgan from 'morgan';
import { connectDB } from './config/db';
import authRouter from './routes/authRoutes';
import { corsConfig } from './config/cors';

dotenv.config();
connectDB();

const app = express();
app.use(cors(corsConfig));

//Logging
app.use(morgan('dev'))

// Leer datos de formularios
app.use(express.json())

// Routes
app.use('/api/auth', authRouter);
app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(swaggerJsDoc({
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Authentication API',
            version: '1.0.0'
        },
        servers: [
            {
                url: 'http://localhost:4000'
            }
        ]
    },
    apis: [`${path.join(__dirname, "./routes/*.ts")}`],
})));

export default app;