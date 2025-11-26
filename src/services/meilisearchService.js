import client from '../config/meilisearch.js';
import Event from "../models/Event.js";
import User from "../models/User.js";
import Category from "../models/Category.js";
import Location from "../models/Location.js";


const syncEventsToMeili = async () => {
  try {
    // Lấy tất cả sự kiện từ DB
    const events = await Event.findAll({
      include: [User, Category, Location]
    });

    // Map dữ liệu
    const docs = events.map(event => ({
      id: event.id,
      name: event.name,
      description: event.description,
      date: event.date,
      User: event.User ? { id: event.User.id, name: event.User.name } : null,
      Category: event.Category ? { id: event.Category.id, name: event.Category.name } : null,
      Location: event.Location ? { id: event.Location.id, name: event.Location.name, city: event.Location.city } : null
    }));

    // Gửi lên Meilisearch
    const index = client.index('events');
    await index.addDocuments(docs);

    console.log(`✅ Indexed ${docs.length} events to Meilisearch`);
  } catch (err) {
    console.error('❌ Sync to Meilisearch failed:', err);
  }
};

export default syncEventsToMeili;
