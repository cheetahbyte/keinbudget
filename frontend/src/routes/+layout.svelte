<script lang="ts">
	import { redirect } from "@sveltejs/kit";
	import Header from "../lib/components/header.svelte";
	import toast, { Toaster } from "svelte-french-toast";
	import { onMount } from "svelte";
	import Footer from "$lib/components/footer.svelte";

    export let data: { user: any };
    const user = data.user

    onMount(() => {
		toast.success("It works!");
	})
    
</script>

<Header {user}/>
<slot/>
<Footer/>
<Toaster />