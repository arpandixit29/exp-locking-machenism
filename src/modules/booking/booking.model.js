let seats = {
    "1": "available",
    "2": "available",
    "3": "available",
    "4": "available",
    "5": "available"
};

const getSeatStatus = (seatId) => {
    return seats[seatId];
};

const bookSeat = (seatId) => {
    seats[seatId] = "booked";
};

export { getSeatStatus, bookSeat };