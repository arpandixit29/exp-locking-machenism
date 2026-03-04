import express from 'express';
import { bookSeatController } from './booking.controller.js';

const router = express.Router();

router.post('/book/:seatId', bookSeatController);

export default router;