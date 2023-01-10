import { useEffect, useState } from "react";
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";

export function Main() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  useEffect(() => {
    window.electronAPI.on("displayInput", (_, message) =>
      setInput(`data:image/jpg;base64,${message}`)
    );
    window.electronAPI.on("displayOutput", (_, message) =>
      setOutput(`data:image/jpg;base64,${message}`)
    );
  }, []);

  return (
    <>
      <div>
        <button onClick={() => window.electronAPI.openFileDialog()}>
          Upload
        </button>
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
          itemOne={<ReactCompareSliderImage src={input} />}
          itemTwo={<ReactCompareSliderImage src={output} />}
        />
      )}
    </>
  );
}
