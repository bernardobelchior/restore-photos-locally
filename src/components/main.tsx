import { ImageProcessor } from "./image-processor";
import { PrerequisitesModal } from "./prerequisites-modal";

export function Main() {
  return (
    <>
      <PrerequisitesModal />
      <ImageProcessor />
    </>
  );
}
