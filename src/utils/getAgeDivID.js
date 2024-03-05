const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");

const getAgeDivID = async (age) => {
  // Loop and add ".." until path is at /src folder
  let ageDivPath = __dirname;
  while (!ageDivPath.endsWith("powerlifting-project")) {
    ageDivPath = path.resolve(ageDivPath, "..");
  }
  ageDivPath = path.resolve(
    ageDivPath,
    "src",
    "app",
    "sql",
    "database",
    "age_div.csv",
  );

  return new Promise((resolve) => {
    let ageDivID = "255"; // Default ID if not found

    fs.createReadStream(ageDivPath)
      .pipe(csv())
      .on("data", (row) => {
        if (age >= parseInt(row.min_age) && age < parseInt(row.max_age)) {
          ageDivID = row.age_div_id;
        }
      })
      .on("end", () => {
        resolve(ageDivID);
      });
  });
};

module.exports = getAgeDivID;
