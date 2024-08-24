<script lang="ts">
	let username: string = '';
	let email: string = '';
	let password: string = '';

	async function register() {
        const data = {
            username: username,
            email: email,
            password:password
        }
        const options: RequestInit = {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            }
        }
		const res = await fetch(`${import.meta.env.VITE_BASE_URL}users/`, options)
        const json = await res.json()
        console.log(json)
	}
</script>

<form on:submit|preventDefault={async () => register()}>
    <label for="email">Email</label>
	<input type="email" id="email" bind:value={email} />
    <label for="username">Username</label>
	<input type="text" id="username" bind:value={username} />
    <label for="password">Password</label>
	<input type="password" id="password" bind:value={password} />
	<button type="submit">Submit</button>
</form>

<style>
    form {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
</style>
