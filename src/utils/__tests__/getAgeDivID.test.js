const getAgeDivID = require("../getAgeDivID");

describe("getAgeDivID", () => {
  it("should return the correct age division ID", async () => {
    // Test case 1: age within the age division range
    const age1 = 17;
    const expectedID1 = "5"; // Replace with the expected age division ID
    const result1 = await getAgeDivID(age1);
    expect(result1).toBe(expectedID1);

    // // Test case 2: age below minimum
    // const age2 = 10;
    // const expectedID2 = "255"; // Replace with the default age division ID
    // const result2 = await getAgeDivID(age2);
    // expect(result2).toBe(expectedID2);

    // // Test case 3: age above maximum
    // const age3 = 40;
    // const expectedID3 = "255"; // Replace with the default age division ID
    // const result3 = await getAgeDivID(age3);
    // expect(result3).toBe(expectedID3);
  });
});
