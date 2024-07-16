<script lang="ts">
	import { goto } from "$app/navigation";

    let username: string = ""
    let password: string = ""
    let errorMsg: string = "";

    async function login() {
        const req = await fetch("http://localhost:3000/users/login", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password})
        })
        const resp = await req.json()
        console.log(req.status)
        if (!req.ok)
        {
            errorMsg = resp;
        }
        goto("/")
    }
</script>

<form on:submit|preventDefault={async() => login()}>
    <input name="username" type="text" placeholder="username" bind:value={username}/>
    <input name="password" type="password" placeholder="password" bind:value={password}/>
    <button type="submit">Login</button>
    {#if errorMsg}
		{errorMsg}
	{/if}
</form>
<style lang="scss">
    form {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
