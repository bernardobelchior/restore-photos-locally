import { exec } from "node:child_process";

export function execPromise(
  command: Parameters<typeof exec>[0],
  options?: Parameters<typeof exec>[1]
): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    exec(command, options, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }

      resolve({ stdout, stderr });
    });
  });
}
