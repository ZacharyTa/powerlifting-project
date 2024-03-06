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
    const compareQuery = `
      SELECT
      (
        -- Get Percent Total
        (SELECT COUNT(DISTINCT lifter_id) FROM lifts_table
        WHERE ? > total
        AND age_div_id = ? 
        AND weight_div_id = ?
        ) /
        (SELECT COUNT(DISTINCT lifter_id) FROM lifts_table
        WHERE age_div_id = ?
        AND weight_div_id = ?
        ) * 100
      ) AS percentStrongerTotal,
      (
        -- Get Percent Bench
        (SELECT COUNT(DISTINCT lifter_id) FROM lifts_table
        WHERE ? > bench
        AND age_div_id = ? 
        AND weight_div_id = ?
        ) /
        (SELECT COUNT(DISTINCT lifter_id) FROM lifts_table
        WHERE age_div_id = ?
        AND weight_div_id = ?
        ) * 100
      ) AS percentStrongerBench,
      (
        -- Get Percent Squat
        (SELECT COUNT(DISTINCT lifter_id) FROM lifts_table
        WHERE ? > squat
        AND age_div_id = ?
        AND weight_div_id = ?
        ) /
        (SELECT COUNT(DISTINCT lifter_id) FROM lifts_table
        WHERE age_div_id = ?
        AND weight_div_id = ?
        ) * 100
      ) AS percentStrongerSquat,
      (
        -- Get Percent Deadlift
        (SELECT COUNT(DISTINCT lifter_id) FROM lifts_table
        WHERE ? > deadlift
        AND age_div_id = ?
        AND weight_div_id = ?
        ) /
        (SELECT COUNT(DISTINCT lifter_id) FROM lifts_table
        WHERE age_div_id = ?
        AND weight_div_id = ?
        ) * 100
      ) AS percentStrongerDeadlift
    ;`;

    const results = await query({
      query: compareQuery,
      values: [
        total, // Total
        ageDivID,
        weightDivID,
        ageDivID,
        weightDivID,
        bench, // Bench
        ageDivID,
        weightDivID,
        ageDivID,
        weightDivID,
        squat, // Squat
        ageDivID,
        weightDivID,
        ageDivID,
        weightDivID,
        deadlift, // Deadlift
        ageDivID,
        weightDivID,
        ageDivID,
        weightDivID,
      ],
    });

    // Round percentages to 1 decimal places
    for (const key in results[0]) {
      if (results[0].hasOwnProperty(key)) {
        results[0][key] = parseFloat(results[0][key]).toFixed(1);
      }
    }

    res.status(200).json({ compareLifts: results });
  }
}
