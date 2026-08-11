const MAX_STEM_LENGTH = 120;

function stripPath(value: string): string {
  return value.replaceAll("\\", "/").split("/").pop() ?? value;
}

function stripLastExtension(value: string): string {
  const dot = value.lastIndexOf(".");
  return dot > 0 ? value.slice(0, dot) : value;
}

export function truncateFilename(name: string, maxLength = 20): string {
  return name.length > maxLength ? `${name.slice(0, maxLength)}…` : name;
}

export function sanitizeFilenameStem(
  value: string,
  fallback = "file",
): string {
  const stem = stripLastExtension(stripPath(value).normalize("NFKC"))
    .replace(/[^\p{L}\p{N}_-]+/gu, "_")
    .replace(/_+/gu, "_")
    .replace(/^[-_]+|[-_]+$/gu, "")
    .slice(0, MAX_STEM_LENGTH)
    .replace(/[-_]+$/gu, "");

  return stem || fallback;
}

function sanitizeSuffix(value: string): string {
  return sanitizeFilenameStem(value, "")
    .toLocaleLowerCase("en")
    .replace(/_/gu, "-");
}

export function deriveOutputStem(
  sourceFilename: string,
  toolSuffix?: string,
  fallback = "file",
): string {
  const source = sanitizeFilenameStem(sourceFilename, fallback);
  const suffix = toolSuffix ? sanitizeSuffix(toolSuffix) : "";
  return `${source}-eburp${suffix ? `-${suffix}` : ""}`;
}

export function finalizeOutputStem(
  editableName: string,
  toolSuffix?: string,
  fallback = "file",
): string {
  const value = sanitizeFilenameStem(editableName, fallback);
  const suffix = toolSuffix ? sanitizeSuffix(toolSuffix) : "";
  const brandedSuffix = `eburp${suffix ? `-${suffix}` : ""}`;

  if (value.toLocaleLowerCase("en").endsWith(`-${brandedSuffix}`)) {
    return value;
  }
  if (value.toLocaleLowerCase("en").endsWith("-eburp") && suffix) {
    return `${value}-${suffix}`;
  }
  return `${value}-${brandedSuffix}`;
}

export function deriveOutputFilename(
  sourceFilename: string,
  toolSuffix: string | undefined,
  extension: string,
  fallback = "file",
): string {
  const safeExtension = extension
    .replace(/^\.+/u, "")
    .replace(/[^a-z0-9]+/giu, "")
    .toLocaleLowerCase("en");
  const stem = deriveOutputStem(sourceFilename, toolSuffix, fallback);
  return safeExtension ? `${stem}.${safeExtension}` : stem;
}

export function finalizeOutputFilename(
  editableName: string,
  toolSuffix: string | undefined,
  extension: string,
  fallback = "file",
): string {
  const safeExtension = extension
    .replace(/^\.+/u, "")
    .replace(/[^a-z0-9]+/giu, "")
    .toLocaleLowerCase("en");
  const stem = finalizeOutputStem(editableName, toolSuffix, fallback);
  return safeExtension ? `${stem}.${safeExtension}` : stem;
}
