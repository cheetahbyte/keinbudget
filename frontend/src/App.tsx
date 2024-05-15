import type { Component } from 'solid-js';

import logo from './logo.svg';
import styles from './App.module.css';

const App: Component = (props: any) => {
  return (
    <>
      {props.children}
    </>
  );
};

export default App;
