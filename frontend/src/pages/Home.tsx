import { createSignal } from "solid-js";
import { currentUser } from "../lib/currentuser";

function Home() {
  const [user, { refetch, mutate }] = currentUser;
  const [field, setField] = createSignal("");
  const [value, setValue] = createSignal("");
  return (
    <>
      <span>{user.loading && "Loading..."}</span>
      <pre>{JSON.stringify(user(), null, 2)}</pre>
      <button onClick={refetch}>Refetch</button>
      <br />
      <input
        type="text"
        name="field"
        onInput={(e) => setField(e.target.value)}
      />
      <br />
      <input
        type="text"
        name="value"
        onInput={(e) => setValue(e.target.value)}
      />
      <br />
      <button
        onClick={() => mutate({ ...(user() as Object), [field()]: value() })}
      >
        Mutate
      </button>
    </>
  );
}

export default Home;
