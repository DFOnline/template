<script lang="ts">
	import Template from "$lib/Template.svelte";
    import { Template as CodeTemplate } from "df.ts";

    var stack = true;
    var openableChests = true;
    var template = CodeTemplate.parse({"blocks":[{"id":"block","block":"event","args":{"items":[]},"action":""},{"id":"block","block":"player_action","args":{"items":[{"item":{"id":"item","data":{"item":"{Count:1b,DF_NBT:3465,id:\"minecraft:diamond_block\",tag:{CustomModelData:0,HideFlags:-1,display:{Lore:['{\"extra\":[{\"bold\":false,\"italic\":false,\"underlined\":false,\"strikethrough\":false,\"obfuscated\":false,\"color\":\"gray\",\"text\":\"Used to execute code when something\"}],\"text\":\"\"}','{\"extra\":[{\"bold\":false,\"italic\":false,\"underlined\":false,\"strikethrough\":false,\"obfuscated\":false,\"color\":\"gray\",\"text\":\"is done by (or happens to) a player.\"}],\"text\":\"\"}','{\"text\":\"\"}','{\"extra\":[{\"bold\":false,\"italic\":false,\"underlined\":false,\"strikethrough\":false,\"obfuscated\":false,\"color\":\"white\",\"text\":\"Example:\"}],\"text\":\"\"}','{\"extra\":[{\"italic\":false,\"color\":\"aqua\",\"text\":\"Â» \"},{\"italic\":false,\"color\":\"gray\",\"text\":\"Detect when a player joins the plot\"}],\"text\":\"\"}','{\"extra\":[{\"italic\":false,\"color\":\"aqua\",\"text\":\"Â» \"},{\"italic\":false,\"color\":\"gray\",\"text\":\"Detect when a player right clicks\"}],\"text\":\"\"}','{\"extra\":[{\"italic\":false,\"color\":\"aqua\",\"text\":\"Â» \"},{\"italic\":false,\"color\":\"gray\",\"text\":\"Detect when a player dies\"}],\"text\":\"\"}'],Name:'{\"italic\":false,\"color\":\"aqua\",\"text\":\"Player Event\"}'}}}"}},"slot":0}]},"action":""}]})

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
