<script lang="ts">
    import {Ellipsis} from "lucide-svelte"
</script>

<div class="card">
	<div class="front"></div>
	<div class="content">
		<h3>Accountname</h3>
	</div>
	<div class="end">
        <Ellipsis color="var(--color-soft-violet)"/>
    </div>
</div>

<style>
	.card {
		width: 18vw;
		height: 10vh;
		box-shadow:
			rgba(0, 0, 0, 0.1) 0px 1px 3px 0px,
			rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
		padding: 5px;
		border-radius: 7px;
		display: grid;
		grid-template-columns: 40px 1fr 40px;
		grid-template-rows: 1fr;
		gap: 0px 0px;
		grid-template-areas: 'front content end';
	}

	.front {
		grid-area: front;
	}
	.content {
		grid-area: content;
	}
    .end {
		grid-area: end;
        display: flex;
        flex-direction: row;
        margin-bottom: 3vh;
        align-items: start;
        margin-top: 15px;
	}

    h3 {
        font-family: "NunitoSans";
        font-weight: 500;
    }
</style>
