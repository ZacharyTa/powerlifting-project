import { query } from "@/lib/database";
import { combinedSQLQuery } from "@/data/compare/percentilesQueries";

export default async function getPercentiles(ageDivID, weightDivID) {
  // Define the parameters
  const params = [ageDivID, weightDivID].map((value) => value.toString());
  const rowParams = new Array(4).fill(params).flatMap((x) => x);

  const rowTotal = await query({
    query: combinedSQLQuery.initialQuery,
    values: rowParams,
  });

  // Set percentileParams = repeat [ageDivID, weightDivID, total] x 50
  // percentileParams += [ageDivID, weightDivID, rowTotal[0].total_totalRows] x 50
  // percentileParams += [ageDivID, weightDivID, rowTotal[0].bench_totalRows] x 50
  // percentileParams += [ageDivID, weightDivID, rowTotal[0].squat_totalRows] x 50
  // percentileParams += [ageDivID, weightDivID, rowTotal[0].deadlift_totalRows] x 50
  const paramsArray = [];

  // Repeat [ageDivID, weightDivID, total] x 50
  for (let i = 0; i < 50; i++) {
    paramsArray.push([ageDivID, weightDivID, rowTotal[0].total_totalRows]);
  }

  // Repeat [ageDivID, weightDivID, bench_totalRows] x 50
  for (let i = 0; i < 50; i++) {
    paramsArray.push([ageDivID, weightDivID, rowTotal[0].bench_totalRows]);
  }

  // Repeat [ageDivID, weightDivID, squat_totalRows] x 50
  for (let i = 0; i < 50; i++) {
    paramsArray.push([ageDivID, weightDivID, rowTotal[0].squat_totalRows]);
  }

  // Repeat [ageDivID, weightDivID, deadlift_totalRows] x 50
  for (let i = 0; i < 50; i++) {
    paramsArray.push([ageDivID, weightDivID, rowTotal[0].deadlift_totalRows]);
  }

  //console.log(rowTotal[0].total_totalRows, rowTotal[0].bench_totalRows, rowTotal[0].squat_totalRows, rowTotal[0].deadlift_totalRows);
  //console.log(paramsArray.length);

  // params: (agediv, weightdiv, rowTotal) x 200
  // Order (total bench, squat deadlift) each 50

  const results = await query({
    query: combinedSQLQuery,
    values: paramsArray,
  });

  console.log(results);

  // Round percentages to 1 decimal place
  //   for (const key in results[0]) {
  //     if (results[0].hasOwnProperty(key)) {
  //       results[0][key] = parseFloat(results[0][key]).toFixed(1);
  //     }
  //   }
  console.log(results);
  return results;
}
