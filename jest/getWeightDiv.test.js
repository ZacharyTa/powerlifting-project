const getWeightDiv = require("../src/utils/getWeightDiv");

describe("getWeightDiv", () => {
  it("should return the correct weight division ID", async () => {
    // Test case 1: weight within weight division range, Female, not in youth division
    const sex1 = "1";
    const weight1 = "80.5";
    const age1 = "30";
    const expectedID1 = "8";
    const expectedDiv1 = "Female - 82.5kg";
    const [weightDiv1, weightID1] = await getWeightDiv(sex1, weight1, age1);
    expect(weightID1).toBe(expectedID1);
    expect(weightDiv1).toBe(expectedDiv1);

    // Test case 2: weight within weight division range, Male, not in youth division
    const sex2 = "0";
    const weight2 = "100.7";
    const age2 = "55";
    const expectedID2 = "20";
    const expectedDiv2 = "Male - 110kg";
    const [weightDiv2, weightID2] = await getWeightDiv(sex2, weight2, age2);
    expect(weightID2).toBe(expectedID2);
    expect(weightDiv2).toBe(expectedDiv2);

    // Test case 3: weight below minimum
    const sex3 = "0";
    const weight3 = "-1.0";
    const age3 = "17";
    const expectedID3 = "255"; // 255 is the default ID if not found
    const expectedDiv3 = "Unknown";
    const [weightDiv3, weightID3] = await getWeightDiv(sex3, weight3, age3);
    expect(weightID3).toBe(expectedID3);
    expect(weightDiv3).toBe(expectedDiv3);

    // Test case 4: weight above maximum
    const sex4 = "0";
    const weight4 = "1000.0";
    const age4 = "25";
    const expectedID4 = "255"; // 255 is the default ID if not found
    const expectedDiv4 = "Unknown";
    const [weightDiv4, weightID4] = await getWeightDiv(sex4, weight4, age4);
    expect(weightID4).toBe(expectedID4);
    expect(weightDiv4).toBe(expectedDiv4);

    // Test case 5: weight within weight division range, Male, in youth division
    const sex5 = "0";
    const weight5 = "42.0";
    const age5 = "12";
    const expectedID5 = "31";
    const expectedDiv5 = "Male Youth - 44kg";
    const [weightDiv5, weightID5] = await getWeightDiv(sex5, weight5, age5);
    expect(weightID5).toBe(expectedID5);
    expect(weightDiv5).toBe(expectedDiv5);

    // Test case 6: weight within weight division range, Female, in youth division
    const sex6 = "1";
    const weight6 = "33.0";
    const age6 = "9";
    const expectedID6 = "25";
    const expectedDiv6 = "Female Youth - 35kg";
    const [weightDiv6, weightID6] = await getWeightDiv(sex6, weight6, age6);
    expect(weightID6).toBe(expectedID6);
  });
});
