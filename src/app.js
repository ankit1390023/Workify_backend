import express, { application, urlencoded } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();





const allowedOrigins = [
    'http://localhost:5173', // For local development
    'https://workify-frontend.vercel.app' // For production
];

app.use(cors({
    origin: function (origin, callback) {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // If using cookies or credentials
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Explicitly allow required methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow necessary headers
}));



app.use(express.json({ limit: "16kb" }));
app.use(urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Import routes
import userRouter from './routes/user.route.js';
import companyRouter from './routes/company.route.js';
import jobRouter from './routes/job.route.js';
import applicationRouter from './routes/application.route.js';
// Route declarations
app.use('/api/v1/user', userRouter);
app.use('/api/v1/company', companyRouter);
app.use('/api/v1/job', jobRouter);
app.use('/api/v1/application', applicationRouter);
export { app };
