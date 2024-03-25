import { query } from "@/lib/database";

function generateQuery(liftType) {
  return `
        (
          (SELECT COUNT(DISTINCT lifter_id) FROM lifts_table
          WHERE ? > ${liftType}
          AND ${liftType} > 0
          AND age_div_id = ? 
          AND weight_div_id = ?
          ) /
          (SELECT COUNT(DISTINCT lifter_id) FROM lifts_table
          WHERE age_div_id = ?
          AND ${liftType} > 0
          AND weight_div_id = ?
          ) * 100
        ) AS ${liftType}
      `;
}

export default async function getPercentStronger(
  total,
  bench,
  squat,
  deadlift,
  ageDivID,
  weightDivID,
) {
  const params = [total, bench, squat, deadlift];
  const PERCENTS = ["total", "bench", "squat", "deadlift"];

  // Create an array for each lift type and concatenate them
  const values = [].concat(
    ...params.map((lift) => [
      lift,
      ageDivID,
      weightDivID,
      ageDivID,
      weightDivID,
    ]),
  );

  const command = `SELECT ${PERCENTS.map((p) => generateQuery(p)).join(" ,")};`;

  const results = await query({
    query: command,
    values: values,
  });

  for (const key in results[0]) {
    if (results[0].hasOwnProperty(key)) {
      results[0][key] = parseFloat(results[0][key]).toFixed(1);
    }
  }

  return results[0];
}
