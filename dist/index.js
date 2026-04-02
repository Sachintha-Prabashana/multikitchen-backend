import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import itemRoutes from './routes/itemRoutes.js';
import stockRoutes from './routes/stockRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import userRoutes from './routes/userRoutes.js';
import backupRoutes from './routes/backupRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import brandRoutes from './routes/brandRoutes.js';
import { errorMiddleware } from './middleware/errorMiddleware.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
// CORS Settings - Vercel frontend URL eka allow karanna
app.use(cors({
    origin: [
        "https://multikitchen-frontend.vercel.app", // Oyaage Vercel Live URL eka
        "http://localhost:3000" // Local dev waladi use karanna
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true
}));
app.use(express.json());
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/users', userRoutes);
app.use('/api/backup', backupRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/brands', brandRoutes);
app.get('/', (req, res) => {
    res.send('Inventory Management API is running...');
});
// Error Handling Middleware
app.use(errorMiddleware);
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
export default app;
