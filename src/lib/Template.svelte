<script lang="ts">
	import Block from './Block.svelte';
	import type Template from '$lib/types/Template.js';
	import { Selection, SelectionEmpty } from './Selection.js';
	import type { ModalComponent, ModalComponentType } from './Menu.js';
	import { combineContextMenus, type ContextMenu } from './ContextMenu.js';
	import ContextContents from './ContextContents.svelte';

	export let template: Template;
	export let selection: Selection = new SelectionEmpty();
	type ActionDump = unknown
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
	export let selectionMode:
		| undefined
		| boolean
		| 'false'
		| 'disabled'
		| 'enabled'
		| 'context-overwrites-single'
		| 'context-overwrites-on-unselected' = 'context-overwrites-single';
	$: realSelectionMode =
		selectionMode == 'false' || selectionMode == 'disabled' ? false : selectionMode;
	/**
	 * Allow editing code
	 */
	export let editable: boolean = true;

	let stackList: number[];
	if (stack) {
		let i: number = 0;
		stackList = template.blocks.map((block) => {
			if (block.id == 'bracket') {
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

	let deleting: number[] = [];
	function deleteBlock(index: number) {
		deleting.push(index);
		if (deleting.length != selection.getSelected().length) return;
		template.blocks = template.blocks.filter((_, i) => !deleting.includes(i));
		deleting = [];
		ctxElement.close();
		selection = new SelectionEmpty().updateRules(selection.rules);
	}

	let svelteBlocks: Block[] = [];
	let currentCtx: ContextMenu | null = null;
	let ctxElement: ModalComponent;
</script>

<svelte:component this={ctx} bind:this={ctxElement}>
	<ContextContents ctx={currentCtx} />
</svelte:component>
<div
	class="template"
	tabindex="0"
	on:keydown={(e) => select(selection.keyPress(e, template.blocks.length))}
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
				draggable
				on:material={realSelectionMode ? (e) => select(selection.click(e.detail, i)) : () => {}}
				on:context={editable
					? (e) => {
							e.detail.preventDefault();
							let selected = selection.getSelected();
							console.log(selected.includes(i));
							if (
								selected.length == 0 ||
								(realSelectionMode == 'context-overwrites-single' && selected.length == 1) ||
								(realSelectionMode == 'context-overwrites-on-unselected' && !selected.includes(i))
							) {
								select(selection.click(e.detail, i));
								selected = selection.getSelected();
							}
							const child = list.children[selection.cursor];
							if (child instanceof HTMLElement) child.focus();
							const blocks = svelteBlocks.filter((_, i) => selected.includes(i));
							currentCtx = combineContextMenus(...blocks.map((b) => b.getContextMenu()));
							ctxElement.open(e.detail);
						}
					: () => {}}
				{openableChests}
				{editable}
				deleteButton={() => deleteBlock(i)}
				bind:this={svelteBlocks[i]}
			/>
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
