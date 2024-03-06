import { query } from "@/lib/database";
import { combinedSQLQuery } from "@/data/compare/strongerPercentsQueries";

export default async function getPercentStronger(
  total,
  bench,
  squat,
  deadlift,
  ageDivID,
  weightDivID,
) {
  // Define the parameters for each lift type
  const params = [total, bench, squat, deadlift];

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

  // Execute the combined query
  const results = await query({
    query: combinedSQLQuery,
    values,
  });

  // Round percentages to 1 decimal place
  for (const key in results[0]) {
    if (results[0].hasOwnProperty(key)) {
      results[0][key] = parseFloat(results[0][key]).toFixed(1);
    }
  }

  return results;
}
