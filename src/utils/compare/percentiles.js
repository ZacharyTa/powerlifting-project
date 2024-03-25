import { query } from "@/lib/database";

export function generateQuery(liftType) {
  return `
    SELECT percentile_rank, lift_value 
    FROM percentiles_table 
    WHERE age_div_id = ? AND weight_div_id = ?
    AND lift_type = '${liftType}';
  `;
}

export default async function getPercentiles(ageDivID, weightDivID) {
  const results = {
    total: [],
    bench: [],
    squat: [],
    deadlift: [],
  };

  await Promise.all(
    Object.entries(results).map(async ([label, value]) => {
      const percentile = await query({
        query: generateQuery(label),
        values: [ageDivID, weightDivID],
      });
      results[label] = value.concat(percentile);
    }),
  );

  return results;
}
