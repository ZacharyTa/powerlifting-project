const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");

const getAgeDivID = async (age) => {
  const ageDivPath = path.resolve(
    process.cwd(),
    "src/app/sql/database/age_div.csv",
  );

  return new Promise((resolve) => {
    let ageDivID = "255"; // Default ID if not found

    fs.createReadStream(ageDivPath)
      .pipe(csv())
      .on("data", (row) => {
        if (
          parseInt(age) >= parseInt(row.min_age) &&
          parseInt(age) < parseInt(row.max_age)
        ) {
          ageDivID = row.age_div_id;
        }
      })
      .on("end", () => {
        resolve(ageDivID);
      });
  });
};

module.exports = getAgeDivID;
