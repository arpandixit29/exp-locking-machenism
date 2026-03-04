import express from "express";
import bookingRoutes from "./modules/booking/booking.route.js"

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: "Redis Locking Mechanism API",
        endpoint: "POST /api/book/:seatId",
        description: "Book a seat using Redis-based distributed locking"
    });
});

app.use('/api', bookingRoutes);

export default app;