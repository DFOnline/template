<script lang="ts">
	import type { ActionDump, Arguments } from "df.ts";
	import Item from "./Item.svelte";

    export let args: Arguments;
    export let actiondump: ActionDump | undefined;
    export let draggable: boolean | undefined = undefined;

    const HEIGHT = 3;
    const WIDTH = 9;

    let dragging: number | null = null;

    $: realSlotIndex = [...Array(WIDTH*HEIGHT).keys()].map(id => args.items.findIndex(item => item.slot == id));
</script>

<table>
    {#each Array(3).keys() as row}
        <tr>
            {#each Array(9).keys() as cell}
            {@const index = row * 9 + cell}
            {@const realIndex = realSlotIndex[index]}
                <td on:dragover|preventDefault on:drop={_ => {if(dragging){args.items[dragging].slot = index; if(args.items[index]) args.items[index].slot = dragging; args.items = args.items; args = args;}}}>
                    {#if realIndex != -1}
                        <Item bind:item={args.items[realIndex].item} {actiondump} {draggable} on:dragstart={_ => dragging = index} on:dragend={_ => dragging = null} />
                    {/if}
                </td>
            {/each}
        </tr>
    {/each}
</table>

<style>
    table {
		outline: 4px solid currentColor;
		width: fit-content;
	}

	td {
		aspect-ratio: 1;
		outline: 2px solid currentColor;
		width: var(--slot-size, auto);
        height: var(--slot-size, auto);
	}
</style>