function generateRowTotalQuery(liftType) {
  return `(SELECT COUNT(*) AS totalRows FROM lifts_table WHERE ${liftType} > 0 AND age_div_id = ? AND weight_div_id = ?) AS ${liftType}_totalRows`;
}

function generateQuery(liftType) {
  let percentileQueries = [];

  for (let p = 1; p <= 99; p += 2) {
    // Note: You will calculate `n` dynamically in your application logic after executing the initialQuery
    // This placeholder is to illustrate the concept
    //let nPlaceholder = `CEILING((${p} / 100) * ?) - 1`;// Total rows = ?
    let nPlaceholder = "100";
    let query = `(SELECT ${liftType} FROM lifts_table WHERE ${liftType} > 0 AND age_div_id = ? AND weight_div_id = ? ORDER BY ${liftType} DESC LIMIT ${nPlaceholder}, 1) AS ${liftType}_percentile${p}`;
    percentileQueries.push(query);
  }
  const percentileQuery = percentileQueries.join(" ,");

  return percentileQuery;
}

export const PERCENTILES = [
  {
    name: "total",
    query: generateQuery("total"),
  },
  {
    name: "bench",
    query: generateQuery("bench"),
  },
  {
    name: "squat",
    query: generateQuery("squat"),
  },
  {
    name: "deadlift",
    query: generateQuery("deadlift"),
  },
];

function combineQueries(percentiles) {
  let initialQuery = percentiles
    .map((p) => generateRowTotalQuery(p.name))
    .join(" ,");
  let combinedQuery = percentiles.map((p) => p.query).join(" ,");
  initialQuery = `SELECT ${initialQuery};`;
  combinedQuery = `SELECT ${combinedQuery};`;

  // Return the complete query
  // How to return a hash table of queries?
  // return { initialQuery, combinedQuery };
  //console.log(initialQuery);
  return { initialQuery, combinedQuery };
}

export const combinedSQLQuery = combineQueries(PERCENTILES);
