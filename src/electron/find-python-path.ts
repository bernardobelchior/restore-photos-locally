import fs from "fs/promises";
import { spawnSync } from "child_process";
import path from "path";

const POSSIBLE_PYTHON_EXECUTABLES = ["python3", "python"];
const MACOS_POSSIBLE_PATHS = ["/usr/bin"];

function getPossiblePlatformSpecificPaths() {
  switch (process.platform) {
    case "darwin":
      return MACOS_POSSIBLE_PATHS;
    default:
      return [];
  }
}

export async function findPythonPath() {
  for (const executable of POSSIBLE_PYTHON_EXECUTABLES) {
    try {
      spawnSync(executable, ["--version"]);
      return executable;
    } catch (_) {
      // Try again
    }
  }

  const platformSpecificPaths = getPossiblePlatformSpecificPaths();
  const accessPromises: Promise<string>[] = [];

  for (const possiblePath of platformSpecificPaths) {
    for (const executable of POSSIBLE_PYTHON_EXECUTABLES) {
      const tentativePath = path.join(possiblePath, executable);
      console.log("path", tentativePath);
      accessPromises.push(fs.access(tentativePath).then(() => tentativePath));
    }
  }

  try {
    const python = await Promise.any(accessPromises);

    console.log(python, "--version");
    const { stdout, stderr } = spawnSync(python, ["--version"]);

    console.log(stdout.toString("utf-8"));
    console.error(stderr.toString("utf-8"));
    return python;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
