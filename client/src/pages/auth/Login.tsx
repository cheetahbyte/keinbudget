
import { createSignal } from "solid-js";
import Requestor from "../../common/requestor";

export const LoginPage = () => {
    const [email, setEmail] = createSignal("");
    const [password, setPassword] = createSignal("");
    const [error, setError] = createSignal("");
  
    async function handleSubmit(e: any) {
      e.preventDefault();
      setError("");
      Requestor.post("users/login", { email: email(), password: password() })
        .then((v) => alert("success"))
        .catch((err) => setError(err));
    }
  
    return (
      <div style={{ "max-width": "300px", margin: "auto" }}>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ "margin-bottom": "10px" }}>
            <label for="email">Email</label>
            <input
              id="email"
              type="text"
              value={email()}
              onInput={(e) => setEmail(e.target.value)}
              required
              style={{ width: "100%", padding: "8px", "margin-bottom": "5px" }}
            />
          </div>
          <div style={{ "margin-bottom": "10px" }}>
            <label for="password">Password</label>
            <input
              id="password"
              type="password"
              value={password()}
              onInput={(e) => setPassword(e.target.value)}
              required
              style={{ width: "100%", padding: "8px", "margin-top": "5px" }}
            />
          </div>
          {error() && (
            <div style={{ color: "red", "margin-bottom": "10px" }}>{error()}</div>
          )}
          <button type="submit" style={{ width: "100%", padding: "10px" }}>
            Login
          </button>
        </form>
      </div>
    );
}