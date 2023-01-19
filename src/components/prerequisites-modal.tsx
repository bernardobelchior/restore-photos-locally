import { useEffect, useState } from "react";

function getPrerequisiteStatusString(status: null | boolean) {
  if (status == null) {
    return "Verifying...";
  }

  return status === true ? "✅ Installed" : "❌ Not installed";
}

export function PrerequisitesModal({
  onPrerequisitesOk,
}: {
  onPrerequisitesOk: () => void;
}) {
  const [prerequisitesStatus, setPrerequisitesStatus] = useState<null | {
    python: boolean;
    gfpgan: boolean;
  }>(null);
  const [prerequisitesInstallStatus, setPrerequisitesInstallStatus] = useState<
    "idle" | "in-progress" | "done"
  >("idle");

  useEffect(() => {
    window.ipc.checkPrerequisites();
  }, []);

  useEffect(() => {
    window.ipc.onCheckPrerequisitesOver((_, { python, gfpgan }) => {
      setPrerequisitesStatus({ python, gfpgan });

      if (python && gfpgan) {
        onPrerequisitesOk();
      }
    });
  }, []);

  function installPrerequisites() {
    window.ipc.onInstallPrerequisitesOver(() => {
      setPrerequisitesInstallStatus("done");
      setPrerequisitesStatus(null);
      window.ipc.checkPrerequisites();
    });

    window.ipc.installPrerequisites();
    setPrerequisitesInstallStatus("in-progress");
  }

  return (
    <div>
      <h4>Prerequisites:</h4>
      <p>
        <span>Python &gt;=3.7: </span>
        <PythonStatus
          status={prerequisitesStatus?.python}
          onCheck={window.ipc.checkPrerequisites}
        />
      </p>
      <p>
        <span>GFPGAN: </span>
        <GfpganStatus
          status={prerequisitesStatus?.gfpgan}
          installStatus={prerequisitesInstallStatus}
          onInstallClick={installPrerequisites}
        />
      </p>
      <p>Once both are installed, you can start restoring photos.</p>
      <p>
        If something is not working, click the button below and copy its content
        into a{" "}
        <a href="https://github.com/bernardobelchior/restore-photos-locally/issues/new">
          new GitHub issue
        </a>
        .
      </p>
      <button onClick={() => window.ipc.showLogs()}>Open logs</button>
    </div>
  );
}

function PythonStatus({
  status,
  onCheck,
}: {
  status: boolean | null;
  onCheck: () => void;
}) {
  return (
    <>
      <span>{getPrerequisiteStatusString(status)}. </span>
      {status === false ? (
        <>
          <a href="https://www.python.org/downloads/">Download Python here.</a>{" "}
          <button onClick={onCheck}>Check installation</button>
        </>
      ) : null}
    </>
  );
}

function GfpganStatus({
  status,
  installStatus,
  onInstallClick,
}: {
  status: boolean | null;
  installStatus: "idle" | "in-progress" | "done";
  onInstallClick: () => void;
}) {
  return (
    <>
      <span>{getPrerequisiteStatusString(status)}</span>
      {status === false ? (
        <button
          onClick={onInstallClick}
          disabled={installStatus === "in-progress"}
          style={{ marginLeft: 4 }}
        >
          {installStatus === "in-progress" ? "Installing..." : "Install"}
        </button>
      ) : null}
    </>
  );
}
