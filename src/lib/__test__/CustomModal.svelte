<script lang="ts">
	let modal: HTMLDivElement;
	let show = false;

	export function open() {
		show = true;
		setTimeout(() => {
			(modal.firstElementChild as HTMLElement)?.focus();
		});
	}
	export function close() {
		show = false;
	}

	function closeKey(event: KeyboardEvent) {
		if (event.key == 'Escape') close();
	}
	function refocus(event: FocusEvent) {
		if (!modal.contains(event?.relatedTarget as Node)) modal.focus();
	}
</script>

<div
	class="modal"
	class:show
	bind:this={modal}
	tabindex="-1"
	role="button"
	on:click={close}
	on:keyup={closeKey}
	on:focusout={refocus}
>
	<div role="cell" class="content" tabindex="-1" on:click|stopPropagation on:keypress={closeKey}>
		<slot />
	</div>
</div>

<style>
	.modal {
		display: none;
		position: fixed;
		top: 0px;
		left: 0px;
		width: 100vw;
		height: 100vh;
		background-color: #0005;
		z-index: 10000;
	}

	.modal:focus .content {
		border-color: blue;
	}

	.modal.show {
		display: flex;
	}

	.content {
		margin: auto;
		padding: 1em;
		background-color: #1c1b22;
		color: currentColor;
		border: 5px solid currentColor;
	}

	@media (prefers-color-scheme: light) {
		.content {
			background-color: #fff;
		}
	}
</style>
