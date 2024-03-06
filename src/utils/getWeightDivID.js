const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");

const getWeightDivID = async (sex, weight, age) => {
  const weightDivPath = path.resolve(
    process.cwd(),
    "src/app/sql/database/weight_div.csv",
  );

  const isYouth = parseInt(age) < 14 ? 1 : 0; // Determine if participant is in youth division

  return new Promise((resolve) => {
    let weightDivID = "255"; // Default ID if not found
    fs.createReadStream(weightDivPath)
      .pipe(csv())
      .on("data", (row) => {
        if (
          parseFloat(weight) >= parseFloat(row.min_weight) &&
          parseFloat(weight) < parseFloat(row.max_weight) &&
          parseInt(sex) === parseInt(row.sex) &&
          isYouth === parseInt(row.is_youth)
        ) {
          weightDivID = row.weight_div_id;
        }
      })
      .on("end", () => {
        resolve(weightDivID);
      });
  });
};

module.exports = getWeightDivID;
