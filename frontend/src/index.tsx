/* @refresh reload */
import { render } from "solid-js/web";
import { Router, Route } from "@solidjs/router";

import Home from "./pages/Home";
import About from "./pages/About";
import "./index.css";
import App from "./App";
import Login from "./pages/auth/Login";
import Accounts from "./pages/accounts/Account"

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?"
  );
}

render(
  () => (
    <Router root={App}>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/login" component={Login} />
      <Route path="/accounts" component={Accounts}/>
    </Router>
  ),
  root!
);
