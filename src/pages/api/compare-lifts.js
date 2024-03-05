import { query } from "@/lib/database";
import getAgeDivID from "@/utils/getAgeDivID";
import getWeightDivID from "@/utils/getWeightDivID";

export default async function handler(req, res) {
  if (req.method === "GET") {
    // Hardcoded for testing development purposes (Forms data will be used here)
    let age = 23;
    let sex = 0;
    let weight = 62;
    let bench = 100;
    let squat = 100;
    let deadlift = 100;
    let total = bench + squat + deadlift;

    // Get the age_div_id and weight_div_id
    const ageDivID = await getAgeDivID(age);
    const weightDivID = await getWeightDivID(sex, weight, age);

    //Calculate the percentage of lifters stronger than the user within the same age and weight division
    let compare_query =
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
      query: compare_query,
      values: [total, ageDivID, weightDivID, ageDivID, weightDivID],
    });

    res.status(200).json({ compare_lifts: results });
  }
}
