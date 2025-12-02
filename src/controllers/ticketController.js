import Ticket from "../models/Ticket.js";
import Event from "../models/Event.js";
import { io } from '../../server.js';

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


export const buyTicket = async (req, res) => {
  try {
    const { ticketId, amount } = req.body; 
    if (!ticketId || !amount || amount <= 0) {
      return res.status(400).json({ error: 'Thông tin mua vé không hợp lệ' });
    }

    const ticket = await Ticket.findByPk(ticketId);
    if (!ticket) return res.status(404).json({ error: 'Vé không tồn tại' });

    if (ticket.quantity < amount) {
      return res.status(400).json({ error: 'Số vé còn lại không đủ' });
    }

    ticket.quantity -= amount;
    ticket.sold += amount;
    await ticket.save();

    console.log(`[REALTIME] Emit ticketUpdate:`, {
      ticketId,
      quantitySold: amount,        // số vé vừa mua
      remaining: ticket.quantity   // số vé còn lại sau khi trừ
    });

    io.emit('ticketUpdate', {
      ticketId,
      quantitySold: amount,
      remaining: ticket.quantity
    });

    res.json({ success: true, message: 'Mua vé thành công', ticket });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi server', details: err.message });
  }
};