import { query } from "@/lib/database";
import { percentileQuery } from "@/data/compare/percentilesQueries";

export default async function getPercentiles(ageDivID, weightDivID) {
  // Define the parameters
  const params = [ageDivID, weightDivID].map((value) => value.toString());

  const percentileTotal = await query({
    query: percentileQuery.total,
    values: params,
  });

  const percentileBench = await query({
    query: percentileQuery.bench,
    values: params,
  });

  const percentileSquat = await query({
    query: percentileQuery.squat,
    values: params,
  });

  const percentileDeadlift = await query({
    query: percentileQuery.deadlift,
    values: params,
  });

  const results = {
    total: percentileTotal,
    bench: percentileBench,
    squat: percentileSquat,
    deadlift: percentileDeadlift,
  };

  return results;
}
