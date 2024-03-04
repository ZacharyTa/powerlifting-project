import { query } from "@/lib/database";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const results = await query({
      query: "SELECT * FROM lifts_table WHERE age < ? LIMIT 10;",
      values: [20],
    });
    res.status(200).json({ compare_lifts: results });
  }
}
