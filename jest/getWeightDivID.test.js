const getWeightDivID = require("../src/utils/getWeightDivID");

describe("getWeightDivID", () => {
  it("should return the correct weight division ID", async () => {
    // Test case 1: weight within weight division range, Female, not in youth division
    const sex1 = 1;
    const weight1 = 80.5;
    const age1 = 30;
    const expectedID1 = "8";
    const result1 = await getWeightDivID(sex1, weight1, age1);
    expect(result1).toBe(expectedID1);

    // Test case 2: weight within weight division range, Male, not in youth division
    const sex2 = 0;
    const weight2 = 100.7;
    const age2 = 55;
    const expectedID2 = "20";
    const result2 = await getWeightDivID(sex2, weight2, age2);
    expect(result2).toBe(expectedID2);

    // Test case 3: weight below minimum
    const sex3 = 0;
    const weight3 = -1.0;
    const age3 = 17;
    const expectedID3 = "255"; // 255 is the default ID if not found
    const result3 = await getWeightDivID(sex3, weight3, age3);
    expect(result3).toBe(expectedID3);

    // Test case 4: weight above maximum
    const sex4 = 0;
    const weight4 = 1000.0;
    const age4 = 25;
    const expectedID4 = "255"; // 255 is the default ID if not found
    const result4 = await getWeightDivID(sex4, weight4, age4);
    expect(result4).toBe(expectedID4);

    // Test case 5: weight within weight division range, Male, in youth division
    const sex5 = 0;
    const weight5 = 42.0;
    const age5 = 12;
    const expectedID5 = "31";
    const result5 = await getWeightDivID(sex5, weight5, age5);
    expect(result5).toBe(expectedID5);

    // Test case 6: weight within weight division range, Female, in youth division
    const sex6 = 1;
    const weight6 = 33.0;
    const age6 = 9;
    const expectedID6 = "25";
    const result6 = await getWeightDivID(sex6, weight6, age6);
    expect(result6).toBe(expectedID6);
  });
});
