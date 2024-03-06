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
  // Execute the combined query
  const results = await query({
    query: combinedSQLQuery,
    values: [
      total,
      ageDivID,
      weightDivID,
      ageDivID,
      weightDivID,
      bench,
      ageDivID,
      weightDivID,
      ageDivID,
      weightDivID,
      squat,
      ageDivID,
      weightDivID,
      ageDivID,
      weightDivID,
      deadlift,
      ageDivID,
      weightDivID,
      ageDivID,
      weightDivID,
    ],
  });

  // Round percentages to 1 decimal place
  for (const key in results[0]) {
    if (results[0].hasOwnProperty(key)) {
      results[0][key] = parseFloat(results[0][key]).toFixed(1);
    }
  }

  return results;
}
