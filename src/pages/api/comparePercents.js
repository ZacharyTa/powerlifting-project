import getAgeDivID from "@/utils/getAgeDivID";
import getWeightDivID from "@/utils/getWeightDivID";
import getPercentStronger from "@/data/compare/strongerPercents";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { age, sexStr, weight, bench, squat, deadlift } = req.query;
      const total = parseInt(bench) + parseInt(squat) + parseInt(deadlift);

      // Binary Encodes sex for SQL query
      const sex = sexStr === "female" ? "1" : "0";

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
