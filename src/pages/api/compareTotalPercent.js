import { query } from "@/lib/database";
import getAgeDivID from "@/utils/getAgeDivID";
import getWeightDivID from "@/utils/getWeightDivID";

export default async function handler(req, res) {
  if (req.method === "GET") {
    // Hardcoded for testing development purposes (Forms data will be used here)
    const age = 23;
    const sex = 0;
    const weight = 62;
    const bench = 100;
    const squat = 100;
    const deadlift = 100;
    const total = bench + squat + deadlift;

    // Get the age_div_id and weight_div_id
    const ageDivID = await getAgeDivID(age);
    const weightDivID = await getWeightDivID(sex, weight, age);

    // Calculate the percentage of lifters stronger than the user within the same age and weight division
    const compareQuery =
      "SELECT " +
      "(" +
      "(SELECT COUNT(DISTINCT lifter_id) FROM lifts_table  " +
      "WHERE ? > total " +
      "AND age_div_id = ? " +
      "AND weight_div_id = ? " +
      ") / " +
      "(SELECT COUNT(DISTINCT lifter_id) FROM lifts_table " +
      "WHERE age_div_id = ? " +
      "AND weight_div_id = ? " +
      ") * 100 " +
      ") AS percentage_of_lifters_stronger_than_x ";

    const results = await query({
      query: compareQuery,
      values: [total, ageDivID, weightDivID, ageDivID, weightDivID],
    });

    res.status(200).json({ compare_lifts: results });
  }
}
