<script lang="ts">
	import { onMount } from "svelte";

    export let user: any;
</script>

<header>
    <h1>keinbudget</h1>
    <div class="user-section">
        <p>{user.username}</p>
        <img src={`https://robohash.org/${user.id}?set=set4`} alt="profile">
    </div>
    
</header>

<style>
    header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        margin-bottom: 5vh;
    }
    h1 {
        font-family: "NunitoSans";
        font-weight: 600;
    }
    .user-section {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-evenly;
        width: 10vw;
    }
    .user-section p{
        font-family: "Nunito";
        font-weight: 500;
        font-size: 1.4em;
        margin: 0;
    }
    .user-section img {
        height: 5vh;
        width: 5vh;
        border-radius: 100%;
        border: grey 2px solid;
    }
</style>