export function countTeleprompterWords(script: string): number {
  if (!script.trim()) return 0;
  return (
    script.match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu) ?? []
  ).length;
}

export function estimateSpeakingSeconds(
  words: number,
  wordsPerMinute = 150,
): number {
  const safeWords = Math.max(
    0,
    Number.isFinite(words) ? Math.round(words) : 0,
  );
  const safeRate = Math.max(
    1,
    Number.isFinite(wordsPerMinute) ? wordsPerMinute : 150,
  );
  return Math.round((safeWords / safeRate) * 60);
}

export function formatTeleprompterClock(totalSeconds: number): string {
  const safeSeconds = Math.max(
    0,
    Math.round(Number.isFinite(totalSeconds) ? totalSeconds : 0),
  );
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function getTeleprompterProgress(
  scrollTop: number,
  scrollHeight: number,
  clientHeight: number,
): number {
  const maximumScroll = Math.max(0, scrollHeight - clientHeight);
  if (maximumScroll === 0) return 100;
  return Math.min(
    100,
    Math.max(0, Math.round((scrollTop / maximumScroll) * 100)),
  );
}

export function getTeleprompterRemainingSeconds(
  scrollTop: number,
  scrollHeight: number,
  clientHeight: number,
  pixelsPerSecond: number,
): number {
  const remainingPixels = Math.max(
    0,
    Math.max(0, scrollHeight - clientHeight) - scrollTop,
  );
  const safeSpeed =
    Number.isFinite(pixelsPerSecond) && pixelsPerSecond > 0
      ? pixelsPerSecond
      : 0;
  return safeSpeed ? Math.ceil(remainingPixels / safeSpeed) : 0;
}
