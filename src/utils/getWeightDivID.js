const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");

const getWeightDivID = async (sex, weight, age) => {
  const weightDivPath = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "..",
    "src",
    "app",
    "sql",
    "database",
    "weight_div.csv",
  );
  let isYouth = age < 14 ? 1 : 0; // Determine if participant is in youth division

  return new Promise((resolve) => {
    let weightDivID = "255"; // Default ID if not found
    fs.createReadStream(weightDivPath)
      .pipe(csv())
      .on("data", (row) => {
        if (
          weight >= parseFloat(row.min_weight) &&
          weight < parseFloat(row.max_weight) &&
          sex === parseInt(row.sex) &&
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
