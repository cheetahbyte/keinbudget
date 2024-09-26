import { render } from 'solid-js/web';
import { Router, Route } from "@solidjs/router";
import App from './App';
import { LoginPage } from './pages/auth/Login';
import { AccountsPage } from './pages/Accounts';

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  );
}

render(() => (
  <Router root={App}>
    <Route path="/login" component={LoginPage}/>
    <Route path="/accounts" component={AccountsPage}/>
  </Router>
), root!);
