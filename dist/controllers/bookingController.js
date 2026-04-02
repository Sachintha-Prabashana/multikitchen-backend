import pkg from '@prisma/client';
import prisma from '../lib/prisma.js';
export const createBooking = async (req, res) => {
    const { name, email, phone, service, date_time } = req.body;
    try {
        const booking = await prisma.booking.create({
            data: {
                name,
                email,
                phone,
                service,
                date_time: new Date(date_time),
            },
        });
        res.status(201).json(booking);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const getBookings = async (req, res) => {
    try {
        const bookings = await prisma.booking.findMany({
            orderBy: { created_at: 'desc' },
        });
        res.json(bookings);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
