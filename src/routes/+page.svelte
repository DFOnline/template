<script lang="ts">
	import Template from "$lib/Template.svelte";
    import { Template as CodeTemplate, DataBlock } from "df.ts";

    var stack = true;
    var openableChests = true;
    var template = CodeTemplate.parse({"blocks":[{"id":"block","block":"event","args":{"items":[]},"action":""},{"id":"block","block":"player_action","args":{"items":[{"item":{"id":"snd","data":{"sound":"Hoglin Attack","pitch":1.0,"vol":2.0,"variant":"attack2_1"}},"slot":0},{"item":{"id":"snd","data":{"sound":"Azalea Leaves Hit","pitch":1.0,"vol":2.0}},"slot":1},{"item":{"id":"pot","data":{"pot":"Glowing","dur":1000000,"amp":0}},"slot":2}]},"action":""}]})

    var blockSize = "16em";
    var tooltipScale = "2.5";
    var slotSize = "3em";
</script>

<h1>template demo</h1>
<p>Example page of template</p>

<div style="position: sticky; width: max-content; left: 0">
    <div>
        <label>
            Block Size:
            <input type="text" bind:value={blockSize} placeholder="10em">
        </label>
        <label>
            Slot Size:
            <input type="text" bind:value={slotSize} placeholder="auto">
        </label>
        <label>
            Tooltip Scale:
            <input type="number" bind:value={tooltipScale} placeholder="2">
        </label>
    </div>
    <br />
    <div>
        <label>
            Stacking?
            <input type="checkbox" bind:checked={stack} />
        </label>
        <label>
            Openable Chests?
            <input type="checkbox" bind:checked={openableChests}>
        </label>
    </div>
</div>

<Template {stack} {openableChests} {template} --tooltip-scale={tooltipScale} --block-size={blockSize} --slot-size={slotSize}/>
