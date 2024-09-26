import { A } from "@solidjs/router";
import { Component, ComponentProps } from "solid-js";

const App: Component = (props: ComponentProps<"div">) => {
    return (
        <>
        <A href="/accounts">Accounts</A>
        <A href="/login">Login</A>
        {props.children}
        </>
    )
}
export default App;