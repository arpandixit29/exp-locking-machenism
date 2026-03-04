import { bookSeatService } from './booking.service.js';

const bookSeatController = async (req, res) => {
    const seatId = req.params.seatId;
    const result = await bookSeatService(seatId);
    return res.status(result.status).json({
        message: result.message
    });
};

export { bookSeatController };