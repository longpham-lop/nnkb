
import Event from "../models/Event.js";
import User from "../models/User.js";
import Category from "../models/Category.js";
import Location from "../models/Location.js";
import client from "../config/meilisearch.js";

const index = client.index("events");

const syncToMeilisearch = async (event) => {
  const data = {
    id: event.id,
    name: event.name,
    description: event.description,
    category_name: event.Category?.name,
    location_name: event.Location?.name,
    organizer_name: event.User?.name,
    start_date: event.start_date,
    end_date: event.end_date,
    status: event.status,
  };
  await index.addDocuments([data]);
};

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.findAll({
      include: [User, Category, Location],
      order: [["id", "DESC"]],
    });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id, {
      include: [User, Category, Location],
    });
    if (!event) return res.status(404).json({ error: "Không tìm thấy sự kiện" });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createEvent = async (req, res) => {
  try {
    const event = await Event.create(req.body);
    const full = await Event.findByPk(event.id, {
      include: [User, Category, Location],
    });
    await syncToMeilisearch(full);
    res.status(201).json(full);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByPk(id);
    if (!event) return res.status(404).json({ error: "Không tìm thấy sự kiện" });

    await event.update(req.body);
    const updated = await Event.findByPk(id, {
      include: [User, Category, Location],
    });

    // Cập nhật Meilisearch
    await syncToMeilisearch(updated);

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByPk(id);
    if (!event) return res.status(404).json({ error: "Không tìm thấy sự kiện" });

    await event.destroy();
    await index.deleteDocument(id);

    res.json({ message: "Đã xóa sự kiện thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const searchEvents = async (req, res) => {
  try {
    const query = req.query.q || "";
    const result = await index.search(query, {
      limit: 10,
      attributesToHighlight: ["name", "description"],
    });
    res.json(result.hits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
