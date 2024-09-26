import { A } from "@solidjs/router";
import styles from "./Navbar.module.css"


function Navbar() {
    return <>
        <div id="navbar" class={styles.navbar}>
            <nav>
                <A href="/">Home</A>
                <A href="/about">About</A>
                <A href="/login">Login</A>
                <A href="/register">register</A>
                <A href="/accounts">Accounts</A>
            </nav>
        </div>
    </>
}


export default Navbar;