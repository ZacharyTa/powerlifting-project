import { query } from "@/lib/database";
import getAgeDivID from "@/utils/getAgeDivID";
import getWeightDivID from "@/utils/getWeightDivID";
const csv = require('csv-parser')
const fs = require('fs')

export default async function handler(req, res) {
    if (req.method === "GET") {
        // Hardcoded for testing development purposes
        let age = 19;
        let sex = 0;
        let weight = 70;
        const ageDivID = await getAgeDivID(age);
        const weightDivID = await getWeightDivID(sex, weight, age);

        res.status(200).json({ageDivID, weightDivID})

    //     const results = await query({
    //         query: 'SELECT * FROM lifts_table WHERE age < ? LIMIT 10;',
    //         values: [20], //Hardcoded for testing purposes
    // });
        //res.status(200).json({compare_lifts: results});
        //res.status(200).json({ "Test": "Bob" });
    }
}
