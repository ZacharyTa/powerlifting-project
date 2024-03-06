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

  // Map the results to an object
  const percentStronger = results.map((result) => ({
    liftType: result.liftType,
    percentStronger: parseFloat(result.percentStronger).toFixed(1),
  }));

  return results;
}
