import path from "path";
import os from "os";

export const INSTALL_DIRECTORY = "restore-photos";
export const GFPGAN_DIRECTORY = "gfpgan";
export const GFPGAN_MODEL_PATH_SUFFIX = path.join(
  "experiments",
  "pretrained_models"
);

export function getInstallDir() {
  return path.join(os.tmpdir(), INSTALL_DIRECTORY);
}

export function getGfpganInstallDir() {
  return path.join(getInstallDir(), GFPGAN_DIRECTORY);
}

export function getGfpganCwd() {
  return process.env.GFPGAN_DIR ?? path.join(getInstallDir(), GFPGAN_DIRECTORY);
}
