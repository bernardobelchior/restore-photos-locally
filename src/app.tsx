import * as ReactDOM from "react-dom";
import { Main } from "./components/main";

function App() {
  return (
    <>
      <h1>Restore photos</h1>
      <p>
        Upload your photo and restore it locally. It uses a local version of
        GFPGAN so the images never leave your computer.
      </p>
      <Main />
    </>
  );
}

function render() {
  ReactDOM.render(<App />, document.getElementById("root"));
}

render();
