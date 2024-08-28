import type { Component, ComponentProps } from "solid-js";

import logo from "./logo.svg";
import styles from "./App.module.css";
import { Router, Route, A } from "@solidjs/router";

const App: Component = (props: ComponentProps<"div">) => {
  return (
    <>
      <h1>Title</h1>
      <nav>
        <A href="/">Home</A>
        <A href="/about">About</A>
        <A href="/login">Login</A>
        <A href="/register">register</A>
      </nav>
      {props.children}
    </>
  );
};

export default App;
