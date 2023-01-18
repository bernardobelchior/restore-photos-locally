import os from "node:os";
import path from "node:path";
import fs from "fs";
import { download } from "electron-dl";
import { BrowserWindow } from "electron";
import unzipper from "unzipper";
import {
  getGfpganInstallDir,
  getInstallDir,
  GFPGAN_MODEL_PATH_SUFFIX,
  INSTALL_DIRECTORY,
} from "./directories";

const GFPGAN_DOWNLOAD_LINK =
  "https://github.com/TencentARC/GFPGAN/archive/refs/tags/v1.3.8.zip";

const MODEL_DOWNLOAD_LINK =
  "https://github.com/TencentARC/GFPGAN/releases/download/v1.3.0/GFPGANv1.3.pth";

export async function installGfpgan() {
  const installDirectory = getInstallDir();
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), INSTALL_DIRECTORY));

  try {
    // Check if directory exists
    fs.accessSync(installDirectory);
  } catch (_) {
    // If it doesn't, create it
    fs.mkdirSync(installDirectory);
  }

  let gfpganZip;
  console.log("Downloading GFPGAN zip file to", tempDir);

  try {
    gfpganZip = (await downloadGfpgan(tempDir)).getSavePath();
  } catch (e) {
    console.error(e);
    throw e;
  }

  const unzipPath = getInstallDir();

  console.log("Cleaning up previous installation");
  fs.rmSync(unzipPath, { recursive: true, force: true });

  console.log("Unzipping GFPGAN zip file into", unzipPath);
  await fs
    .createReadStream(gfpganZip)
    .pipe(unzipper.Extract({ path: unzipPath }))
    .promise();

  const gfpganDir = fs
    .readdirSync(unzipPath)
    .filter((dir) => dir.startsWith("GFPGAN"))[0];

  if (!gfpganDir) {
    const error = new Error("Could not find extracted GFPGAN directory.");
    console.error(error);
    throw error;
  }

  const gfpganPath = path.join(unzipPath, gfpganDir);
  fs.renameSync(gfpganPath, getGfpganInstallDir());

  console.log("GFPGAN installed successfully.");

  // TODO: Install dependencies.

  console.log("Installing v1.3 model...");

  // Possibly install this before the first conversion to speed it up
  //try {
  //  const destination = path.join(gfpganPath, GFPGAN_MODEL_PATH_SUFFIX);
  //  console.log("Downloading GFPGAN model to", destination);

  //  await downloadGfpgan(destination);
  //} catch (e) {
  //  console.error(e);
  //  throw e;
  //}

  console.log("GFPGAN model installed successfully.");
}

async function downloadGfpgan(
  destination: string
): Promise<Electron.DownloadItem> {
  return await download(
    BrowserWindow.getFocusedWindow(),
    GFPGAN_DOWNLOAD_LINK,
    {
      directory: destination,
    }
  );

  // FIXME: Handle errors
}
