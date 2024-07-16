<script lang="ts">
	import { onMount } from 'svelte'
    interface Account {
        id: string
        name: string
        balance: number
    }
    interface T {
        accounts: Array<Account>,
    }

    /** @type {import('./$types').PageData} */
	export let data: T;

    onMount(() => console.log(data))
</script>

<h1>Your accounts</h1>
{#each data.accounts as d}
    <p>{d.name}</p>
{/each}