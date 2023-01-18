import { useState } from "react";
import { ImageProcessor } from "./image-processor";
import { PrerequisitesModal } from "./prerequisites-modal";

export function Main() {
  const [prerequisitesOk, setPrerequisitesOk] = useState(false);

  return (
    <>
      {prerequisitesOk ? (
        <ImageProcessor />
      ) : (
        <PrerequisitesModal
          onPrerequisitesOk={() => setPrerequisitesOk(true)}
        />
      )}
    </>
  );
}
