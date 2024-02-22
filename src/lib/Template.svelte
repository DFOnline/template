<script lang="ts">
	import Block from './Block.svelte';
	import { ActionDump, Bracket, type Template } from 'df.ts';
	import { Selection, SelectionEmpty } from './Selection.js';
	import type { ModalComponent, ModalComponentType } from './Menu.js';

	export let template: Template;
	export let selection: Selection = new SelectionEmpty();
	export let actiondump: ActionDump | undefined = undefined;
	export let modal: ModalComponentType;
	export let ctx: ModalComponentType;
	/**
	 * If blocks in brackets should be shifted.
	 */
	export let stack: boolean = false;
	/**
	 * Allows disabling of opening chests.
	 */
	export let openableChests: boolean = true;
	/**
	 * Allows selecting code
	 */
	export let selectable: boolean = true;
	/**
	 * Allow editing code
	 */
	export let editable: boolean = true;

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
	let list: HTMLDivElement;

	function select(select: Selection | void) {
		if (select == null) return;
		selection = select;
		const child = list.children[select.cursor];
		if (child instanceof HTMLElement) child.focus();
	}
</script>

<div
	class="template"
	tabindex="0"
	on:keydown={(e) => select(selection.keyPress(e, template.blocks.length))}
	on:contextmenu={() => {
		const child = list.children[selection.cursor];
		if (child instanceof HTMLElement) child.focus();
	}}
	role="button"
	bind:this={list}
>
	{#each template.blocks as block, i (block)}
		<div
			style:padding-top={stack ? `${stackList[i] * 1.25}em;` : '0em'}
			class="block"
			class:selected={selection.isSelected(i)}
			tabindex="-1"
			role="toolbar"
		>
			<Block
				{modal}
				{actiondump}
				{block}
				{i}
				on:material={(e) => select(selection.click(e.detail, i))}
				{openableChests}
				{editable}
				{ctx}
			>
			<button on:click|stopPropagation={() => {
				console.log("hi")
				template.blocks.splice(i,1);
				template = template;
			}}>Delete</button>
			</Block>
		</div>
	{/each}
</div>

<style class="template">
	@font-face {
		src: url('./media/MinecraftRegular-Bmg3.otf');
		font-family: 'Minecraft';
	}

	div.template {
		padding: 0;
		margin: 0;
		list-style: none;
		display: flex;
	}

	div.block {
		height: calc(var(--block-size, var(--block-size, 10em)) * 2);
		display: flex;
		outline: none;
	}

	div.block.selected {
		background-color: #3584e4;
	}
</style>
