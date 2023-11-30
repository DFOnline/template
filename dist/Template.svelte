<script>import Block from "./Block.svelte";
import { ActionDump, Bracket } from "df.ts";
import { Selection, SelectionEmpty } from "./Selection.js";
export let template;
export let selection = new SelectionEmpty();
export let actiondump = void 0;
export let modal;
export let context;
export let stack = false;
export let openableChests = true;
export let selectable = true;
export let editable = true;
let stackList;
if (stack) {
  let i = 0;
  stackList = template.blocks.map((block) => {
    if (block instanceof Bracket) {
      if (block.direct == "open") {
        const old = i;
        i++;
        return old;
      }
      if (block.direct == "close") {
        i--;
      }
    }
    return i;
  });
}
let list;
function select(select2) {
  if (select2 == null)
    return;
  selection = select2;
  const child = list.children[select2.cursor];
  if (child instanceof HTMLElement)
    child.focus();
}
let contextMenus = [];
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
	{#each template.blocks as block, i}
		<div
			style:padding-top={stack ? `${stackList[i] * 1.25}em;` : '0em'}
			class="block"
			class:selected={selection.isSelected(i)}
			tabindex="-1"
			role="toolbar"
			on:contextmenu={editable
				? (e) => {
						e.preventDefault();
						if (!selection.isSelected(i)) select(selection.click(e, i));
						contextMenus[i].open();
				  }
				: undefined}
		>
			<Block
				{modal}
				{actiondump}
				{block}
				{i}
				on:material={(e) => select(selection.click(e.detail, i))}
				{openableChests}
			/>
			<svelte:component this={context} bind:this={contextMenus[i]}>
				<button
					on:click={() => {
						contextMenus[i].close();
						const removeValFromIndex = selection.getSelected().toSorted((a,b) => a-b);

						for (var index = removeValFromIndex.length -1; index >= 0; index--)
						template.blocks.splice(removeValFromIndex[index],1);

						select(new Selection(removeValFromIndex[0] - 1).updateRules(selection.rules));
						template = template;
					}}>Delete</button
				>
			</svelte:component>
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
