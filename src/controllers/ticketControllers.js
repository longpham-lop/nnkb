import db from "../models/index.js";

const Ticket = db.Ticket;

export const createTicket = async (req, res) => {
    try {
        const ticket = await Ticket.create(req.body);
        res.status(201).json(ticket);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const getTickets = async (req, res) => {
    try {
        const tickets = await Ticket.findAll();
        res.json(tickets);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getTicketById = async (req, res) => {
    try {
        const ticket = await Ticket.findByPk(req.params.id);
        if (!ticket) return res.status(404).json({ error: "Ticket not found" });
        res.json(ticket);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
