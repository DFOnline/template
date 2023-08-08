<script lang="ts">
	import Template from "$lib/Template.svelte";
    import { Template as CodeTemplate, DataBlock } from "df.ts";

    var stack = true;
    var openableChests = true;
    var template = CodeTemplate.parse({"blocks":[{"id":"block","block":"event","args":{"items":[]},"action":""},{"id":"block","block":"player_action","args":{"items":[{"item":{"version":1,"id":"g_val","data":{"type":"Player Count","target":"Default"}},"slot":0},{"item":{"version":1,"id":"loc","data":{"isBlock":false,"loc":{"x":3.2662368164715474,"y":50.0,"z":10.300000011920929,"pitch":10.551422,"yaw":-55.668755}}},"slot":1},{"item":{"version":1,"id":"vec","data":{"x":1.0,"y":2.2,"z":3.547}},"slot":2},{"item":{"version":1,"id":"snd","data":{"mappingVersion":0,"sound":"minecraft:block.azalea_leaves.hit","pitch":0.890899,"vol":1.0}},"slot":3},{"item":{"version":1,"id":"pot","data":{"mappingVersion":0,"pot":"minecraft:speed","dur":1000000,"amp":0}},"slot":4},{"item":{"version":1,"id":"pot","data":{"mappingVersion":0,"pot":"minecraft:speed","dur":15,"amp":-256}},"slot":5},{"item":{"version":1,"id":"g_val","data":{"type":"Current Health","target":"Default"}},"slot":6},{"item":{"version":1,"id":"g_val","data":{"type":"Current Health","target":"Selection"}},"slot":7},{"item":{"version":1,"id":"g_val","data":{"type":"Current Health","target":"Killer"}},"slot":8},{"item":{"version":1,"id":"g_val","data":{"type":"Current Health","target":"Damager"}},"slot":9},{"item":{"version":1,"id":"g_val","data":{"type":"Current Health","target":"Victim"}},"slot":10},{"item":{"version":1,"id":"g_val","data":{"type":"Current Health","target":"Shooter"}},"slot":11},{"item":{"version":1,"id":"g_val","data":{"type":"Current Health","target":"Projectile"}},"slot":12},{"item":{"version":1,"id":"g_val","data":{"type":"Current Health","target":"LastEntity"}},"slot":13}]},"action":""}]})

</script>

<h1>template demo</h1>
<p>Example page of template</p>

<div style="position: sticky; width: max-content; left: 0">
    <label>
        Stacking?
        <input type="checkbox" bind:checked={stack} />
    </label>
    <label>
        Openable Chests?
        <input type="checkbox" bind:checked={openableChests}>
    </label>
</div>

<Template {stack} {openableChests} {template} --tooltip-size="3"/>
