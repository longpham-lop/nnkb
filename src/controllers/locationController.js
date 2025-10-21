import Location from "../models/Location.js";

export const getAllLocations = async (req, res) => {
  try {
    const locations = await Location.findAll({ order: [["id", "DESC"]] });
    res.json(locations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getLocationById = async (req, res) => {
  try {
    const location = await Location.findByPk(req.params.id);
    if (!location) return res.status(404).json({ error: "Không tìm thấy địa điểm" });
    res.json(location);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createLocation = async (req, res) => {
  try {
    const { name, address, city, province, capacity, map_link } = req.body;
    if (!name || !address) return res.status(400).json({ error: "Tên và địa chỉ là bắt buộc" });

    const location = await Location.create({
      name,
      address,
      city,
      province,
      capacity,
      map_link,
    });
    res.status(201).json(location);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const location = await Location.findByPk(id);
    if (!location) return res.status(404).json({ error: "Không tìm thấy địa điểm" });

    await location.update(req.body);
    res.json(location);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const location = await Location.findByPk(id);
    if (!location) return res.status(404).json({ error: "Không tìm thấy địa điểm" });

    await location.destroy();
    res.json({ message: "Đã xóa địa điểm thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
