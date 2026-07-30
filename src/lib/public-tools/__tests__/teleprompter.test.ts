import {
  countTeleprompterWords,
  estimateSpeakingSeconds,
  formatTeleprompterClock,
  getTeleprompterProgress,
  getTeleprompterRemainingSeconds,
} from "../teleprompter";

describe("public Teleprompter utilities", () => {
  it("counts Unicode words and contractions", () => {
    expect(countTeleprompterWords("Hello, don't stop. Café 2026.")).toBe(5);
    expect(countTeleprompterWords("   ")).toBe(0);
  });

  it("estimates and formats speaking time safely", () => {
    expect(estimateSpeakingSeconds(300)).toBe(120);
    expect(estimateSpeakingSeconds(100, 200)).toBe(30);
    expect(estimateSpeakingSeconds(-10)).toBe(0);
    expect(formatTeleprompterClock(125)).toBe("2:05");
    expect(formatTeleprompterClock(Number.NaN)).toBe("0:00");
  });

  it("calculates bounded scroll progress and remaining time", () => {
    expect(getTeleprompterProgress(250, 1_200, 200)).toBe(25);
    expect(getTeleprompterProgress(-20, 1_200, 200)).toBe(0);
    expect(getTeleprompterProgress(2_000, 1_200, 200)).toBe(100);
    expect(getTeleprompterProgress(0, 200, 200)).toBe(100);
    expect(
      getTeleprompterRemainingSeconds(250, 1_200, 200, 50),
    ).toBe(15);
    expect(
      getTeleprompterRemainingSeconds(250, 1_200, 200, 0),
    ).toBe(0);
  });
});
