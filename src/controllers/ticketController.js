import Ticket from "../models/Ticket.js";
import Event from "../models/Event.js";

export const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.findAll({ include: [Event] });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findByPk(req.params.id, { include: [Event] });
    if (!ticket) return res.status(404).json({ error: "Không tìm thấy vé" });
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createTicket = async (req, res) => {
  try {
    const { event_id, name, price, quantity, sale_start, sale_end, seat_type } = req.body;
    const event = await Event.findByPk(event_id);
    if (!event) return res.status(404).json({ error: "Không tìm thấy sự kiện" });

    const ticket = await Ticket.create({
      event_id,
      name,
      price,
      quantity,
      sale_start,
      sale_end,
      seat_type,
      sold: 0,
    });

    res.status(201).json(ticket);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findByPk(id);
    if (!ticket) return res.status(404).json({ error: "Không tìm thấy vé" });

    await ticket.update(req.body);
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findByPk(id);
    if (!ticket) return res.status(404).json({ error: "Không tìm thấy vé" });

    await ticket.destroy();
    res.json({ message: "Đã xóa vé thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
