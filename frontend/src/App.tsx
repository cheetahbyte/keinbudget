import type { Component, ComponentProps } from "solid-js";
import Navbar from "./lib/components/Navbar";
import styles from "./styles/common.module.css";


const App: Component = (props: ComponentProps<"div">) => {
  return (
    <>
      <Navbar/>
      <div id="content">
        <h1>Title</h1>
        {props.children}
      </div>

    </>

  );
};

export default App;
