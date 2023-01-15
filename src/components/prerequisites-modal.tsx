import { useEffect, useState } from "react";

function getPrerequisiteStatusString(status: null | boolean) {
  if (status === null) {
    return "Verifying...";
  }

  return status === true ? "✅ Installed" : "❌ Not installed";
}

export function PrerequisitesModal() {
  const [prerequisitesStatus, setPrerequisitesStatus] = useState<null | {
    python: boolean;
    gfpgan: boolean;
  }>(null);

  useEffect(() => {
    window.electronAPI.checkPrerequisites();
  }, []);

  useEffect(() => {
    window.electronAPI.on("check-prerequisites-over", (_, { python, gfpgan }) =>
      setPrerequisitesStatus({ python, gfpgan })
    );
  }, []);

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
      </p>
    </div>
  );
}
