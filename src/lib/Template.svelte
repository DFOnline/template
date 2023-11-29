<script lang="ts">
	import Block from './Block.svelte';
	import { ActionDump, Bracket, type Template } from 'df.ts';
	import type { Selection } from './Selection.js';

	export let template: Template;
	export let selection: Selection;
	export let actiondump: ActionDump | undefined = undefined;
	/**
	 * If blocks in brackets should be shifted.
	 */
	export let stack: boolean = false;
	/**
	 * Allows disabling of opening chests.
	 */
	export let openableChests: boolean = true;

	let stackList: number[];
	if (stack) {
		let i: number = 0;
		stackList = template.blocks.map((block) => {
			if (block instanceof Bracket) {
				if (block.direct == 'open') {
					const old = i;
					i++;
					return old;
				}
				if (block.direct == 'close') {
					i--;
				}
			}
			return i;
		});
	}
</script>

<ul>
	{#each template.blocks as block, i}
		<div
			style:padding-top={stack ? `${stackList[i] * 1.25}em;` : '0em'}
			class="blocky"
			class:selected={selection.isSelected(i)}
			on:keydown={(e) => (selection = selection.keyPress(e, template.blocks.length))}
			tabindex="0"
			role="toolbar"
		>
			<Block {actiondump} {block} {i} on:material={e => selection.click(e,i)} {openableChests} />
		</div>
	{/each}
</ul>

<style>
	@font-face {
		src: url('./media/MinecraftRegular-Bmg3.otf');
		font-family: 'Minecraft';
	}

	ul {
		padding: 0;
		margin: 0;
		list-style: none;
		display: flex;
	}

	div.blocky {
		height: calc(var(--block-size, var(--block-size, 10em)) * 2);
		display: flex;
	}

	div.blocky.selected {
		background-color: #3584e4;
	}
</style>
