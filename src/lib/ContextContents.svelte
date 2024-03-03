<script lang="ts">
	import type { ContextMenu } from './ContextMenu.ts';

	export let ctx: ContextMenu | undefined | null;

	const buttons: HTMLInputElement[] = [];
</script>

{#if ctx != null}
	{#each ctx.items as button, i}
		{#if button.type != 'button'}
			<label>
				{button.label}
				<input
					bind:this={buttons[i]}
					type={button.type == 'checkbox' ? 'checkbox' : 'text'}
					value={button.value}
					checked={(typeof button.value == 'boolean' && button.value) ?? false}
					indeterminate={button.value == null}
					on:change={() =>
						button.update(button.type == 'checkbox' ? buttons[i].checked : buttons[i].value)}
				/>
			</label>
		{:else}
			<button on:click={() => button.update(undefined)}>{button.label}</button>
		{/if}
	{/each}
{/if}
