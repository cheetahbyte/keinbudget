<script lang="ts">
	import Account from '$lib/components/cards/account.svelte';
	import { greetUser } from '$lib/util';
	export let data;
</script>

<h1 style="margin: 5vh;">{greetUser(data.user.username)}</h1>

<div class="cards">
	<Account />
	<Account />
	<Account />
	<Account />
	<Account />
	<Account />
	<Account />
</div>

<style>
	.cards {
		display: flex;
		flex-direction: row;
		align-items: center;
		width: 60vw;
		justify-content: space-evenly;
		flex-wrap: wrap;
	}
</style>
