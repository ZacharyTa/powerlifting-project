function generateQuery(liftType) {
  return `
  SELECT percentile_rank, lift_value 
  FROM percentiles_table 
  WHERE age_div_id = ? AND weight_div_id = ?
  AND lift_type = '${liftType}';
`;
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

function percentileQueries(percentiles) {
  const percentileQuery = {};

  percentiles.forEach((p) => {
    percentileQuery[p.name] = p.query;
  });

  return percentileQuery;
}

export const percentileQuery = percentileQueries(PERCENTILES);
