function generateQuery(liftType) {
  return `
      (
        (SELECT COUNT(DISTINCT lifter_id) FROM lifts_table
        WHERE ? > ${liftType}
        AND age_div_id = ? 
        AND weight_div_id = ?
        ) /
        (SELECT COUNT(DISTINCT lifter_id) FROM lifts_table
        WHERE age_div_id = ?
        AND weight_div_id = ?
        ) * 100
      ) AS percentStronger${capitalizeFirstLetter(liftType)}
    `;
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const PERCENTS = [
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

function combineQueries(percents) {
  const combinedQuery = percents.map((p) => p.query).join(" ,");

  // Return the complete query
  return `SELECT ${combinedQuery};`;
}

export const combinedSQLQuery = combineQueries(PERCENTS);
