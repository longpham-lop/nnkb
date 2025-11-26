import { MeiliSearch } from "meilisearch";

const client = new MeiliSearch({
  host: "https://meilisearch-n6iz.onrender.com",
  apiKey: process.env.MEILI_MASTER_KEY,
});

export default client;
