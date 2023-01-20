import os from "node:os";
import path from "node:path";
import fs from "fs";
import { download } from "electron-dl";
import { BrowserWindow } from "electron";
import unzipper from "unzipper";
import {
  getGfpganCwd,
  getGfpganInstallDir,
  getInstallDir,
  getPythonDepsDir,
  GFPGAN_MODEL_PATH_SUFFIX,
  INSTALL_DIRECTORY,
} from "./directories";
import { execPromise } from "../utils/exec-promise";

const GFPGAN_DOWNLOAD_LINK =
  "https://github.com/TencentARC/GFPGAN/archive/refs/tags/v1.3.8.zip";

const MODEL_DOWNLOAD_LINK =
  "https://github.com/TencentARC/GFPGAN/releases/download/v1.3.0/GFPGANv1.3.pth";

const PYTHON_DEPENDENCIES = ["basicsr", "facexlib", "realesrgan"];

export async function installPrerequisites(python: string) {
  const window = BrowserWindow.getFocusedWindow();
  const installDirectory = getInstallDir();
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), INSTALL_DIRECTORY));

  try {
    // Check if directory exists
    fs.accessSync(installDirectory);
  } catch (_) {
    // If it doesn't, create it
    fs.mkdirSync(installDirectory);
  }

  await installGfpgan(window, tempDir);

  await Promise.all([
    installPythonDependencies(python),
    installGfpganModel(window, getGfpganInstallDir()),
  ]);

  await installGfpganPythonRequirements(python);
}

async function downloadGfpgan(
  window: BrowserWindow,
  destination: string
): Promise<Electron.DownloadItem> {
  return download(window, GFPGAN_DOWNLOAD_LINK, {
    directory: destination,
    overwrite: true,
  });

  // FIXME: Handle errors
}

async function installGfpgan(window: BrowserWindow, tempDir: string) {
  let gfpganZip;
  console.log("Downloading GFPGAN zip file to", tempDir);

  try {
    gfpganZip = (await downloadGfpgan(window, tempDir)).getSavePath();
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
}

async function downloadGfpganModel(
  window: BrowserWindow,
  destination: string
): Promise<Electron.DownloadItem> {
  return download(window, MODEL_DOWNLOAD_LINK, {
    directory: destination,
    overwrite: true,
  });
}

async function installGfpganModel(window: BrowserWindow, gfpganPath: string) {
  console.log("Installing v1.3 model...");

  try {
    const destination = path.join(gfpganPath, GFPGAN_MODEL_PATH_SUFFIX);
    console.log("Downloading GFPGAN model to", destination);

    const item = await downloadGfpganModel(window, destination);

    console.log("GFPGAN model installed successfully.");

    return item;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

async function installPythonDependencies(python: string) {
  const pythonDepsDir = getPythonDepsDir();

  console.log("Installing GFPGAN dependencies.");

  await execPromise(
    `${python} -m pip install --target=${pythonDepsDir} ${PYTHON_DEPENDENCIES.join(
      " "
    )}`,
    {
      cwd: getInstallDir(),
    }
  );

  console.log("GFPGAN dependencies installed successfully.");
}

async function installGfpganPythonRequirements(python: string) {
  const pythonDepsDir = getPythonDepsDir();

  console.log("Installing GFPGAN requirements.");

  await execPromise(
    `${python} -m pip install --target=${pythonDepsDir} -r requirements.txt`,
    {
      cwd: getGfpganCwd(),
    }
  );

  console.log("GFPGAN requirements installed successfully.");
  console.log("Setting up GFPGAN.");

  await execPromise(`${python} setup.py develop --prefix ${pythonDepsDir}`, {
    cwd: getGfpganCwd(),
    env: {
      ...process.env,
      PYTHONPATH: `${pythonDepsDir}:${process.env.PYTHONPATH}`,
    },
  });

  console.log("GFPGAN setup completed successfully.");
}
