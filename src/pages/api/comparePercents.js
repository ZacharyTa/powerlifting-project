import getAgeDivID from "@/utils/getAgeDivID";
import getWeightDivID from "@/utils/getWeightDivID";
import getPercentStronger from "@/data/compare/strongerPercents";

export default async function handler(req, res) {
  if (req.method === "GET") {
    // Hardcoded for testing development purposes (Forms data will be used here)
    const age = "23";
    const sex = "0";
    const weight = "62";
    const bench = "100";
    const squat = "100";
    const deadlift = "100";
    const total = bench + squat + deadlift;

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
  }
}
