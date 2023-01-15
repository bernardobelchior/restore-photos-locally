import { useEffect, useState } from "react";
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";

export function ImageProcessor() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  useEffect(() => {
    window.electronAPI.on("displayInput", (_, message) => setInput(message));
    window.electronAPI.on("displayOutput", (_, message) => setOutput(message));
  }, []);

  return (
    <>
      <div>
        <button onClick={() => window.electronAPI.openFileDialog()}>
          Upload
        </button>

        {output ? (
          <button onClick={() => window.electronAPI.openSaveDialog(output)}>
            Download
          </button>
        ) : null}
      </div>

      {!input || !output ? (
        !input ? (
          "Please upload a file"
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
