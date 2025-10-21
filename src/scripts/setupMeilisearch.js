// scripts/setupMeilisearch.js
import client from "../config/meilisearch.js";

const setupIndex = async () => {
  const index = client.index("events");

  await index.updateSearchableAttributes([
    "name", "description", "category_name", "location_name", "organizer_name",
  ]);

  await index.updateFilterableAttributes([
    "status", "start_date", "end_date", "category_name",
  ]);

  console.log("✅ Đã cấu hình Meilisearch cho events");
};

setupIndex();
