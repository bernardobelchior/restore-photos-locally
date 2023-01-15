import { dialog, IpcMain } from "electron";
import fs from "node:fs/promises";
import path from "node:path";
import { exec } from "node:child_process";
import { isGfpganInstalled, isPythonVersionValid } from "./check-prerequisites";

export function setupIpc(ipcMain: IpcMain) {
  ipcMain.on("open-file-dialog", async (event) => {
    const cwd = process.env.GFPGAN_DIR;
    const { filePaths } = await dialog.showOpenDialog({
      properties: ["openFile"],
    });

    const filePath = filePaths[0];

    const inputFile = await fs.readFile(filePath);
    event.reply("displayInput", inputFile.toString("base64"));

    const fileName = path.basename(filePath);
    const outputPath = `${cwd}/results/restored_imgs/${fileName}`;

    try {
      await fs.access(outputPath);
    } catch (_) {
      const promise = new Promise<void>((resolve, reject) => {
        exec(
          `python inference_gfpgan.py --bg_upsampler realesrgan -i '${filePath}' -o results -v 1.3 -s 2`,
          { cwd },
          (error, stdout, stderr) => {
            if (error) {
              console.error(error);
              reject(error);
              return;
            }

            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
            resolve();
          }
        );
      });

      await promise;
    }

    const outputFile = await fs.readFile(outputPath);
    event.reply("displayOutput", outputFile.toString("base64"));
  });

  ipcMain.on("open-save-dialog", async (_, image: string) => {
    try {
      const { filePath } = await dialog.showSaveDialog({});

      await fs.writeFile(`${filePath}.jpg`, image, "base64");
    } catch (e) {
      console.error(`Error downloading file: ${e}`);
    }
  });

  ipcMain.on("check-prerequisites", async (event) => {
    const cwd = process.env.GFPGAN_DIR;
    const isPythonVersionOk = isPythonVersionValid();
    const isGFPGANVersionOk = isGfpganInstalled(cwd);

    event.reply("check-prerequisites-over", {
      python: await isPythonVersionOk,
      gfpgan: await isGFPGANVersionOk,
    });
  });
}
