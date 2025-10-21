import { MeiliSearch } from "meilisearch";

const client = new MeiliSearch({
  host: "http://127.0.0.1:7700",
  apiKey: process.env.MEILI_MASTER_KEY,
});

export default client;
