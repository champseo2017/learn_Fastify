import { pathToFileURL } from "node:url";
import { dirname, resolve as pathResolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("@/")) {
    const resolved = pathToFileURL(
      pathResolve(__dirname, "src", specifier.slice(2))
    ).href;
    return nextResolve(resolved);
  }

  if (specifier.startsWith("@config/")) {
    const resolved = pathToFileURL(
      pathResolve(__dirname, "src/config", specifier.slice(8))
    ).href;
    return nextResolve(resolved);
  }

  if (specifier.startsWith("@routes/")) {
    const resolved = pathToFileURL(
      pathResolve(__dirname, "src/routes", specifier.slice(8))
    ).href;
    return nextResolve(resolved);
  }

  return nextResolve(specifier, context);
}
