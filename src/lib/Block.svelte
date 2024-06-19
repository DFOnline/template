<script lang="ts">
	// import {
	// 	Block,
	// 	Bracket,
	// 	ArgumentBlock,
	// 	Arguments,
	// 	Argument,
	// 	TemplateBlock,
	// 	DataBlock,
	// 	ActionBlock,
	// 	idToName,
	// 	ActionDump
	// } from 'df.ts';
	import { isActionBlock, isArgumentBlock, isSubActionBlock, type ActionBlock, type Block } from '$lib/types/Template.js';
	
	import { createEventDispatcher } from 'svelte';
	import type { ModalComponent, ModalComponentType } from './Menu.js';
	import { ContextButton, ContextMenu } from './ContextMenu.js';
	import Inventory from './Inventory.svelte';

	const event = createEventDispatcher<{ material: MouseEvent; context: MouseEvent }>();
	const ctx = (e: MouseEvent) => event('context', e);
	const mat = (e: MouseEvent) => event('material', e);

	export let i: number;
	export let block: Block;
	export let openableChests: boolean = true;
	export let editable: boolean = true;
	export let draggable: boolean = false;
	export let deleteButton: (() => void) | undefined = undefined;

	type ActionDump = false;
	export let actiondump: ActionDump | undefined;
	export let modal: ModalComponentType;

	$: hasChest =
		isArgumentBlock(block) && block.block != 'call_func' && !block.block.includes('event');
	let modalMenu: ModalComponent;

	function chestClick(event: MouseEvent | KeyboardEvent) {
		if ((event.target as HTMLElement).classList.contains('chest')) {
			if (event instanceof KeyboardEvent) {
				if (!(event.key === 'Enter' || event.key === ' ')) {
					return;
				}
			}
			modalMenu.open();
		}
	}

	// TODO: move this in to df.ts Arguments
	function sortInventory(items?: Arguments): (Argument | undefined)[] {
		const sorted = new Array(9 * 3);
		items?.items.forEach((item) => {
			sorted[item.slot] = Argument.parse(item);
		});
		return sorted;
	}

	export function getContextMenu(): ContextMenu {
		const buttons: ContextButton<any>[] = [];
		if (isActionBlock(block)) {
			if (true) {
				const actionField = new ContextButton('text', 'Action', console.log, 'hi');
				buttons.push(actionField);
			}
			if (block.block.includes('if')) {
				const not = new ContextButton(
					'checkbox',
					'NOT',
					(v) => {
						block.attribute = v;
						block = block;
					},
					block.attribute
				);
				buttons.push(not);
			}
			if (block.block.includes('event')) {
				const Cancel = new ContextButton(
					'checkbox',
					'LC-CANCEL',
					(v) => {
						block.cancelled = v;
						block = block;
					},
					block.cancelled
				);
				buttons.push(Cancel);
			}
		}
		if (deleteButton != null && editable) {
			buttons.push(new ContextButton('button', 'delete', deleteButton));
		}
		return new ContextMenu(...buttons);
	}
</script>

{#if openableChests && block instanceof ArgumentBlock}
	<svelte:component this={modal} bind:this={modalMenu}>
		<h1>
			{i + 1}: {idToName.get(block.block)}
			{#if block instanceof DataBlock || block instanceof ActionBlock}
				{block.secondLine}{/if}
		</h1>
		<Inventory args={block.args ?? new Arguments()} {actiondump} {draggable} />
	</svelte:component>
{/if}

<div class="block" draggable={draggable && editable} on:dragstart={(e) => console.log(e)} role="button" tabindex="-1">
	{#if block instanceof Bracket}
		<div
			class={`bracket ${block.direct} ${block.type}`}
			role="button"
			on:click={mat}
			on:contextmenu={ctx}
			on:keypress={() => undefined}
			tabindex="-1"
		></div>
	{/if}

	{#if block instanceof Block}
		<div class="left" on:contextmenu={ctx} role="button" tabindex="-1">
			<div class="top">
				{#if hasChest}
					<span
						class:clickable={openableChests}
						class="chest"
						on:click={openableChests ? chestClick : undefined}
						on:keydown={openableChests ? chestClick : undefined}
						role="button"
						tabindex="-1"
					>
					</span>
				{/if}
			</div>
			<div
				class={`material ${block.block}`}
				on:click={mat}
				on:keypress={() => undefined}
				role="button"
				tabindex="-1"
			>
				<div class="sign">
					{#if block.block != 'else'}
						<span>
							{idToName.get(block.block)}
						</span>
					{/if}
					<span>
						{#if 'secondLine' in block}
							{block.secondLine}
						{/if}
					</span>
					<span>
						{#if 'thirdLine' in block}
							{block.thirdLine}
						{/if}
					</span>
					<span>
						{#if 'forthLine' in block}
							{block.forthLine}
						{/if}
					</span>
				</div>
			</div>
		</div>
		{#if !(block.block.includes('if') || block.block === 'repeat')}
			<div
				class="right"
				on:click={mat}
				on:contextmenu={ctx}
				on:keypress={() => undefined}
				role="button"
				tabindex="-1"
			></div>
		{/if}
	{/if}
</div>

<style>
	.block {
		display: flex;
		width: fit-content;
	}

	.left {
		height: calc(var(--block-size, var(--block-size, 10em)) * 2);
		width: var(--block-size, 10em);
		display: grid;
		grid-template-rows: 50% 50%;
	}

	.material {
		display: flex;
		align-content: center;
		background-size: contain;
		background-repeat: no-repeat;
		background-position: center;
	}

	.sign {
		margin: auto;
		height: 50%;
		width: 100%;
		font-size: calc(var(--block-size, 10em) / 10);
		font-family: 'Minecraft';
		display: grid;
		grid-template-rows: 1fr 1fr 1fr 1fr;
		flex-flow: column;
		text-align: center;
		background-image: url('./media/blocks/sign.png');
		background-size: contain;
	}

	.top {
		display: grid;
	}

	.chest {
		background-image: url('./media/blocks/chest.png');
		background-size: contain;
		background-repeat: no-repeat;
		background-position: center bottom;
	}
	.chest.clickable {
		cursor: pointer;
	}

	.right {
		height: var(--block-size, 10em);
		width: var(--block-size, 10em);
		background-image: url('./media/blocks/stone.png');
		background-size: contain;
		background-repeat: no-repeat;
		background-position: center bottom;
		margin-top: var(--block-size, 10em);
	}

	/* I recognize this from somewhere */
	.event {
		background-image: url(./media/blocks/event.png);
	}
	.player_action {
		background-image: url(./media/blocks/player_action.png);
	}
	.if_player {
		background-image: url(./media/blocks/if_player.png);
	}
	.process {
		background-image: url(./media/blocks/process.png);
	}
	.start_process {
		background-image: url(./media/blocks/start_process.png);
	}
	.func {
		background-image: url(./media/blocks/func.png);
	}
	.call_func {
		background-image: url(./media/blocks/call_func.png);
	}
	.entity_event {
		background-image: url(./media/blocks/entity_event.png);
	}
	.entity_action {
		background-image: url(./media/blocks/entity_action.png);
	}
	.if_entity {
		background-image: url(./media/blocks/if_entity.png);
	}
	.if_var {
		background-image: url(./media/blocks/if_var.png);
	}
	.set_var {
		background-image: url(./media/blocks/set_var.png);
	}
	.if_game {
		background-image: url(./media/blocks/if_game.png);
	}
	.game_action {
		background-image: url(./media/blocks/game_action.png);
	}
	.repeat {
		background-image: url(./media/blocks/repeat.png);
	}
	.control {
		background-image: url(./media/blocks/control.png);
	}
	.select_obj {
		background-image: url(./media/blocks/select_obj.png);
	}
	.else {
		background-image: url(./media/blocks/else.png);
	}

	.bracket {
		margin-top: var(--block-size, 10em);
		height: var(--block-size, 10em);
		width: var(--block-size, 10em);
		align-content: center;
		background-size: contain;
		background-repeat: no-repeat;
		background-position: center;
	}
	.close {
		margin-left: var(--block-size, 10em);
	}
	.bracket.norm {
		background-image: url(./media/blocks/piston.png);
	}
	.bracket.repeat {
		background-image: url(./media/blocks/pistonSticky.png);
	}
	.bracket.close {
		transform: scaleX(-1);
	}

	h1 {
		margin-top: 0;
	}
</style>
