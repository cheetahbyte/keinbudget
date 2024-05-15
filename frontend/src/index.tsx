/* @refresh reload */
import { render } from 'solid-js/web';
import {Router, Route} from "@solidjs/router"

import './index.css';
import App from './App';
import IndexPage from "./pages/index.page"
import AboutPage from "./pages/about.page"
import AccountsPage from "./pages/accounts.page"
import AccountPage from "./pages/account.page"

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  );
}

render(() => (
  <Router root={App}>
      <Route path="/" component={IndexPage}/>
      <Route path="/about" component={AboutPage}/>
      <Route path="/accounts" component={AccountsPage}/>
      <Route path="/account/:id" component={AccountPage}/>
    </Router>
), root!);
