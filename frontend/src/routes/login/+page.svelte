<script lang="ts">
	let email: string = '';
	let password: string = '';

	async function login() {
		const data = {
			email: email,
			password: password
		};
		const options: RequestInit = {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		};
		const res = await fetch(`${import.meta.env.VITE_BASE_URL}users/login`, options);
		const json = await res.json();
	}
</script>

<form on:submit|preventDefault={async () => login()}>
	<input type="email" bind:value={email} />
	<input type="password" bind:value={password} />
	<button type="submit">Submit</button>
</form>
