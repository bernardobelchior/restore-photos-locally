import { execPromise } from "../utils/exec-promise";

// Obtains major, minor and patch versions as capturing groups.
const PYTHON_VERSION_REGEX = /Python ([0-9]+)\.([0-9]+)\.([0-9]+)/;

/**
 * Ensures Python version is >=3.7.
 */
async function ensurePythonVersionIsValid() {
  let stdout;
  try {
    // TODO: Add timeout in case the python command hangs?
    const command = "python --version";
    console.log(command);
    const std = await execPromise(command);
    stdout = std.stdout;

    console.log(stdout);
    console.error(std.stderr);
  } catch (e) {
    console.error(e);
    throw Error(
      "Error running `python --version`. Make sure you have Python installed."
    );
  }

  const [match, majorStr, minorStr, patchStr] =
    stdout.match(PYTHON_VERSION_REGEX);
  const major = parseInt(majorStr);
  const minor = parseInt(minorStr);
  const patch = parseInt(patchStr);

  if (
    match === null ||
    !Number.isFinite(major) ||
    !Number.isFinite(minor) ||
    !Number.isFinite(patch)
  ) {
    throw Error("Could not obtain Python version from `python --version`.");
  }

  if (major <= 2 || (major === 3 && minor < 7)) {
    throw Error(
      `Python version ${major}.${minor}.${patch} does not meet minimum requirements of Python >= 3.7.`
    );
  }
}

export async function isPythonVersionValid() {
  try {
    await ensurePythonVersionIsValid();
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

async function ensureGfpganInstalled(cwd: string) {
  try {
    // TODO: Add timeout in case the command hangs?
    const command = "python inference_gfpgan.py --help";
    console.log(command);
    const { stdout, stderr } = await execPromise(command, { cwd });

    console.log(stdout);
    console.error(stderr);
  } catch (e) {
    console.error(e);
    throw Error(
      "Error running `python inference_gfpgan.py --help`. Make sure you have GFPGAN installed."
    );
  }
}

export async function isGfpganInstalled(cwd: string) {
  try {
    await ensureGfpganInstalled(cwd);
    return true;
  } catch (_) {
    return false;
  }
}
