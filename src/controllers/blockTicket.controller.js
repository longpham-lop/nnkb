import BlockTicket from "../models/blockTicket.model.js";

export const createBlockTicket = async (req, res) => {
  try {
    const ticketsInput = Array.isArray(req.body) ? req.body : [req.body];

    const ticketsToCreate = [];

    ticketsInput.forEach(ticket => {
      const {
        order_id,
        ticket_id,
        quantity = 1, 
        unit_price,
        tx_hash,
        wallet_address
      } = ticket;

      for (let i = 0; i < quantity; i++) {
        ticketsToCreate.push({
          order_id,
          ticket_id,
          unit_price,
          tx_hash,
          wallet_address
        });
      }
    });

    const createdTickets = await Promise.all(
      ticketsToCreate.map(ticket => BlockTicket.create(ticket))
    );

    res.status(201).json(createdTickets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


export const getAllBlockTickets = async (req, res) => {
  try {
    const tickets = await BlockTicket.findAll();
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getBlockTicketById = async (req, res) => {
  try {
    const ticket = await BlockTicket.findByPk(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Not found" });
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getBlockTicketByOrder = async (req, res) => {
  try {
    const tickets = await BlockTicket.findAll({ where: { order_id: req.params.order_id } });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateCheckIn = async (req, res) => {
  try {
    const ticket = await BlockTicket.findByPk(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Not found" });

    ticket.checked_in = req.body.checked_in;
    await ticket.save();

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteBlockTicket = async (req, res) => {
  try {
    const ticket = await BlockTicket.findByPk(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Not found" });

    await ticket.destroy();
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
