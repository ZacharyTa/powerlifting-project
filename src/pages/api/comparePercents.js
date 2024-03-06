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
        (SELECT COUNT(DISTINCT lifter_id) FROM lifts_table
        WHERE ${total} > total
        AND age_div_id = ${ageDivID} 
        AND weight_div_id = ${weightDivID}
        ) /
        (SELECT COUNT(DISTINCT lifter_id) FROM lifts_table
        WHERE age_div_id = ${ageDivID}
        AND weight_div_id = ${weightDivID}
        ) * 100
      ) AS percentStrongerTotal,
      (
        (SELECT COUNT(DISTINCT lifter_id) FROM lifts_table
        WHERE ${bench} > bench
        AND age_div_id = ${ageDivID} 
        AND weight_div_id = ${weightDivID}
        ) /
        (SELECT COUNT(DISTINCT lifter_id) FROM lifts_table
        WHERE age_div_id = ${ageDivID}
        AND weight_div_id = ${weightDivID}
        ) * 100
      ) AS percentStrongerBench,
      (
        (SELECT COUNT(DISTINCT lifter_id) FROM lifts_table
        WHERE ${squat} > squat
        AND age_div_id = ${ageDivID} 
        AND weight_div_id = ${weightDivID}
        ) /
        (SELECT COUNT(DISTINCT lifter_id) FROM lifts_table
        WHERE age_div_id = ${ageDivID}
        AND weight_div_id = ${weightDivID}
        ) * 100
      ) AS percentStrongerSquat,
      (
        (SELECT COUNT(DISTINCT lifter_id) FROM lifts_table
        WHERE ${deadlift} > deadlift
        AND age_div_id = ${ageDivID} 
        AND weight_div_id = ${weightDivID}
        ) /
        (SELECT COUNT(DISTINCT lifter_id) FROM lifts_table
        WHERE age_div_id = ${ageDivID}
        AND weight_div_id = ${weightDivID}
        ) * 100
      ) AS percentStrongerDeadlift
    ;`;

    const results = await query({
      query: compareQuery,
      values: [total, ageDivID, weightDivID, ageDivID, weightDivID],
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
