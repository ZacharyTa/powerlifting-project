const getAgeDiv = require("../src/utils/getAgeDiv");

describe("getAgeDiv", () => {
  jest.mock("path", () => ({
    ...jest.requireActual("path"),
    resolve: () => "/mocked/path/to/age_div.csv",
  }));

  it("should return the correct age division ID", async () => {
    // Test case 1: age within the age division range
    const age1 = "17";
    const expectedID1 = "5";
    const expectedDiv1 = "Teen 2";
    const [ageDiv1, ageID1] = await getAgeDiv(age1);
    expect(ageID1).toBe(expectedID1);
    expect(ageDiv1).toBe(expectedDiv1);

    const age2 = "109";
    const expectedID2 = "14";
    const expectedDiv2 = "Master 7";
    const [ageDiv2, ageID2] = await getAgeDiv(age2);
    expect(ageID2).toBe(expectedID2);
    expect(ageDiv2).toBe(expectedDiv2);

    // Test case 2: age below minimum
    const age3 = "7";
    const expectedID3 = "255"; // 255 is the default ID if not found
    const expectedDiv3 = "Unknown";
    const [ageDiv3, ageID3] = await getAgeDiv(age3);
    expect(ageID3).toBe(expectedID3);
    expect(ageDiv3).toBe(expectedDiv3);

    // Test case 3: age above maximum
    const age4 = "111";
    const expectedID4 = "255"; // 255 is the default ID if not found
    const expectedDiv4 = "Unknown";
    const [ageDiv4, ageID4] = await getAgeDiv(age4);
    expect(ageID4).toBe(expectedID4);
    expect(ageDiv4).toBe(expectedDiv4);
  });
});
