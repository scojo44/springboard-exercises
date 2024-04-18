const isBalanced = require("./balanced-brackets");

describe("balanced-brackets", function() {
  it("should have balanced brackets", () => {
    expect(isBalanced("hello")).toBe(true);
    expect(isBalanced("(hi) [there]")).toBe(true);
    expect(isBalanced("(hi [there])")).toBe(true);
    expect(isBalanced("(((hi)))")).toBe(true);
  });
  it("should have imbalanced brackets", () => {
    expect(isBalanced("(hello")).toBe(false);
    expect(isBalanced("(nope]")).toBe(false);
    expect(isBalanced("((ok) [nope)]")).toBe(false);
  });
});
