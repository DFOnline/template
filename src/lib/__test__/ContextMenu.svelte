<script lang="ts">
	let show = false;
	let context: HTMLDivElement;
	let pos: { x: number; y: number } | null = null;

	export function openStatic(_?: MouseEvent) {
		pos = null;
		open();
	}
	export function open(event?: MouseEvent) {
		if (event != null) pos = { x: event.clientX, y: event.clientY };
		show = true;
		setTimeout(() => {
			context.focus();
		});
	}
	export function close() {
		pos = null;
		show = false;
	}

	function unfocus(event: FocusEvent) {
		if (!context.contains(event?.relatedTarget as Node)) close();
	}
</script>

<svelte:window on:scroll={close} />
{#if show}
	<div
		bind:this={context}
		on:keydown
		on:keypress
		on:keyup
		on:focusout={unfocus}
		role="toolbar"
		tabindex="0"
		style:--x={pos?.x}
		style:--y={pos?.y}
	>
		<slot />
	</div>
{/if}

<style>
	div {
		position: fixed;
		left: calc(var(--x) * 1px);
		top: calc(var(--y) * 1px);
		background: #000;
		display: flex;
	}
</style>
