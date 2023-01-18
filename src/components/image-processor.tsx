import { useEffect, useState } from "react";
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";

export function ImageProcessor() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const inProgress = input !== "" && output === "";

  useEffect(() => {
    window.ipc.onInputImageLoaded((_, message) => setInput(message));
    window.ipc.onOutputImageLoaded((_, message) => setOutput(message));
  }, []);

  return (
    <>
      <div>
        <button
          onClick={() => window.ipc.openFileDialog()}
          disabled={inProgress}
        >
          {inProgress ? "Restoring..." : "Upload"}
        </button>

        {output ? (
          <button onClick={() => window.ipc.openSaveDialog(output)}>
            Download
          </button>
        ) : null}
      </div>

      {!input || !output ? (
        !input ? (
          "Please upload a file (.jpg or .png)"
        ) : (
          "Loading..."
        )
      ) : (
        <ReactCompareSlider
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            marginTop: 24,
          }}
          itemOne={
            <ReactCompareSliderImage src={`data:image/jpg;base64,${input}`} />
          }
          itemTwo={
            <ReactCompareSliderImage src={`data:image/jpg;base64,${output}`} />
          }
        />
      )}
    </>
  );
}
