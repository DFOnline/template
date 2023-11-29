<script lang="ts">
	import {
		Block,
		Bracket,
		ArgumentBlock,
		Arguments,
		Argument,
		TemplateBlock,
		DataBlock,
		ActionBlock,
		idToName,
		ActionDump
	} from 'df.ts';
	import Item from './Item.svelte';

    import { createEventDispatcher } from 'svelte';

    const event = createEventDispatcher()

	export let i: number;
	export let block: TemplateBlock;
	export let openableChests: boolean = true;

	export let actiondump: ActionDump | undefined;

	function chestClick(event: MouseEvent | KeyboardEvent) {
		if (event.target instanceof HTMLElement) {
			let diag = event.target.classList.contains('bg') ? event.target.parentElement : event.target;
			if (diag instanceof HTMLDialogElement) {
				diag.close();
			}
		}
		if ((event.target as HTMLElement).classList.contains('chest')) {
			if (event instanceof KeyboardEvent) {
				if (!(event.key === 'Enter' || event.key === ' ')) {
					return;
				}
			}
			((event.target as HTMLSpanElement).querySelector('dialog') as HTMLDialogElement).showModal();
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
</script>

{#if block instanceof Bracket}
	<div class={`bracket ${block.direct} ${block.type}`}></div>
{/if}
{#if block instanceof Block}
	<div class="left">
		<div class="top">
			{#if block instanceof ArgumentBlock && block.block != 'call_func' && !block.block.includes('event')}
				<span
					class:clickable={openableChests}
					class="chest"
					on:click={openableChests ? chestClick : undefined}
					on:keydown={openableChests ? chestClick : undefined}
					role="button"
					tabindex="0"
				>
					{#if openableChests}
						<dialog style="cursor: auto;">
							<div class="bg">
								<div>
									<h1>
										{i + 1}: {idToName.get(block.block)}
										{#if block instanceof DataBlock || block instanceof ActionBlock}
											{block.secondLine}{/if}
									</h1>
									<table>
										{#each sortInventory(block.args) as item}
											<td class={`slot`}>
												{#if item != null}<Item item={item.item} {actiondump} />{/if}
											</td>
										{/each}
									</table>
								</div>
							</div>
						</dialog>
					{/if}
				</span>
			{/if}
		</div>
		<div
			class={`material ${block.block}`}
			on:click={(e) => (event('material',e))}
			on:keypress={() => undefined}
			role="button"
			tabindex="0"
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
		<div class="right"></div>
	{/if}
{/if}

<style>
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

	/* I recognise this from somewhere */
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

	dialog {
		background: none;
		border: none;
		padding: 0;
		margin: 0;
		overflow: hidden;
		min-width: 100vw;
		min-height: 100vh;
	}

	dialog > .bg {
		width: 100vw;
		height: 100vh;
		display: flex;
	}

	dialog .bg > div {
		margin: auto;
		padding: 1em;
		background: white;
		border: solid 5px black;
	}

	dialog h1 {
		margin-top: 0;
	}

	dialog table {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
		grid-auto-rows: 1fr 1fr 1fr;
		outline: 4px solid black;
		width: fit-content;
	}

	.slot {
		aspect-ratio: 1;
		outline: 2px solid black;
		width: var(--slot-size, auto);
	}
</style>
