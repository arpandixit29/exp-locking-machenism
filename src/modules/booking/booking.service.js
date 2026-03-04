import { acquireLock, releaseLock } from '../../utils/lock.util.js';
import { getSeatStatus, bookSeat } from './booking.model.js';

const bookSeatService = async (seatId) => {
    const lockKey = `lock:seat:${seatId}`;
    const lockValue = await acquireLock(lockKey, 10);

    if (!lockValue) {
        return { status: 423, message: "Seat is currently locked. Try again." };
    }

    try {
        const seatStatus = getSeatStatus(seatId);

        if (!seatStatus) {
            return { status: 404, message: "Seat not found." };
        }

        if (seatStatus !== "available") {
            return { status: 400, message: "Seat already booked." };
        }

        bookSeat(seatId);
        return { status: 200, message: `Seat ${seatId} booked successfully.` };

    } finally {
        await releaseLock(lockKey, lockValue);
    }
};

export { bookSeatService };