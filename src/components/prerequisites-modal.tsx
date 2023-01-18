import { useEffect, useState } from "react";

function getPrerequisiteStatusString(status: null | boolean) {
  if (status == null) {
    return "Verifying...";
  }

  return status === true ? "✅ Installed" : "❌ Not installed";
}

export function PrerequisitesModal() {
  const [prerequisitesStatus, setPrerequisitesStatus] = useState<null | {
    python: boolean;
    gfpgan: boolean;
  }>(null);
  const [prerequisitesInstallStatus, setPrerequisitesInstallStatus] = useState<
    "idle" | "in-progress" | "done"
  >("idle");

  useEffect(() => {
    window.electronAPI.checkPrerequisites();
  }, []);

  useEffect(() => {
    window.electronAPI.on("check-prerequisites-over", (_, { python, gfpgan }) =>
      setPrerequisitesStatus({ python, gfpgan })
    );
  }, []);

  function installPrerequisites() {
    window.electronAPI.on("install-prerequisites-over", () => {
      setPrerequisitesInstallStatus("done");
      setPrerequisitesStatus(null);
      window.electronAPI.checkPrerequisites();
    });

    window.electronAPI.installPrerequisites();
    setPrerequisitesInstallStatus("in-progress");
  }

  return (
    <div>
      <h4>Prerequisites:</h4>
      <p>
        <span>Python &gt;=3.7: </span>
        <span>{getPrerequisiteStatusString(prerequisitesStatus?.python)}</span>
      </p>
      <p>
        <span>GFPGAN: </span>
        <span>{getPrerequisiteStatusString(prerequisitesStatus?.gfpgan)}</span>
        {prerequisitesStatus?.gfpgan === false ? (
          <button
            onClick={installPrerequisites}
            disabled={prerequisitesInstallStatus === "in-progress"}
            style={{ marginLeft: 4 }}
          >
            {prerequisitesInstallStatus === "in-progress"
              ? "Installing..."
              : "Install"}
          </button>
        ) : null}
      </p>
    </div>
  );
}
