import getAgeDivID from "@/utils/getAgeDivID";
import getWeightDivID from "@/utils/getWeightDivID";
import getPercentStronger from "@/data/compare/strongerPercents";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      let { age, sex, unit, weight, bench, squat, deadlift } = req.query;
      const total = parseInt(bench) + parseInt(squat) + parseInt(deadlift);

      // Binary Encodes sex for SQL query
      sex = sex === "female" ? "1" : "0";

      // Unit Conversion
      if (unit === "lbs") {
        weight = Math.round(weight / 2.20462);
        bench = Math.round(bench / 2.20462);
        squat = Math.round(squat / 2.20462);
        deadlift = Math.round(deadlift / 2.20462);
      }

      // Get the age_div_id and weight_div_id
      const ageDivID = await getAgeDivID(age);
      const weightDivID = await getWeightDivID(sex, weight, age);

      // Calculate the percentage of lifters stronger than the user within the same age and weight division
      const results = await getPercentStronger(
        total,
        bench,
        squat,
        deadlift,
        ageDivID,
        weightDivID,
      );

      res.status(200).json({ compareLifts: results });
    } catch (error) {
      console.error("An error occurred:", error);
      res
        .status(500)
        .json({ error: "An error occurred while getting request." });
    }
  }
}
