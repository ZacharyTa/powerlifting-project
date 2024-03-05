const getAgeDivID = require("../src/utils/getAgeDivID");

describe("getAgeDivID", () => {
  jest.mock("path", () => ({
    ...jest.requireActual("path"),
    resolve: () => "/mocked/path/to/age_div.csv",
  }));

  it("should return the correct age division ID", async () => {
    // Test case 1: age within the age division range
    const age1 = 17;
    const expectedID1 = "5";
    const result1 = await getAgeDivID(age1);
    expect(result1).toBe(expectedID1);

    const age2 = 109;
    const expectedID2 = "14";
    const result2 = await getAgeDivID(age2);
    expect(result2).toBe(expectedID2);

    // Test case 2: age below minimum
    const age3 = 7;
    const expectedID3 = "255"; // 255 is the default ID if not found
    const result3 = await getAgeDivID(age3);
    expect(result3).toBe(expectedID3);

    // Test case 3: age above maximum
    const age4 = 111;
    const expectedID4 = "255"; // 255 is the default ID if not found
    const result4 = await getAgeDivID(age4);
    expect(result4).toBe(expectedID4);
  });
});
