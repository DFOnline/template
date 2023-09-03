<script lang="ts">
	import Template from "$lib/Template.svelte";
    import { ActionDump, Template as CodeTemplate } from "df.ts";

    var stack = true;
    var openableChests = true;
    var template = CodeTemplate.parse({"blocks":[
        {"id":"block","block":"func","args":{"items":[{"item":{"id":"pn_el","data":{"name":"name","type":"any","default_value":{"id":"num","data":{"name":"0"}},"plural":false,"optional":true}},"slot":0},{"item":{"id":"pn_el","data":{"name":"name","type":"var","plural":true,"optional":false}},"slot":1},{"item":{"id":"pn_el","data":{"name":"name","type":"dict","plural":true,"optional":true}},"slot":2},{"item":{"id":"pn_el","data":{"name":"name","type":"list","plural":false,"optional":false}},"slot":3},{"item":{"id":"pn_el","data":{"name":"name","type":"vec","plural":false,"optional":false,"description":"hi&ahi<green>hi","note":"&ahi<green>hi"}},"slot":4},{"item":{"id":"hint","data":{"id":"function"}},"slot":25},{"item":{"id":"bl_tag","data":{"option":"False","tag":"Is Hidden","action":"dynamic","block":"func"}},"slot":26}]},"data":""},
        {"id":"block","block":"player_action","args":{"items":[{"item":{"id":"txt","data":{"name":"&astring! %default"}},"slot":0}]},"action":""},
        {"id":"block","block":"player_action","args":{"items":[{"item":{"id":"comp","data":{"name":"<green>hi"}},"slot":0}]},"action":""},
        {"id":"block","block":"player_action","args":{"items":[{"item":{"id":"num","data":{"name":"%var(&chi)"}},"slot":0}]},"action":""},
        {"id":"block","block":"player_action","args":{"items":[{"item":{"id":"loc","data":{"isBlock":false,"loc":{"x":2.100503566321322,"y":64.14752328981187,"z":22.627610902878587,"pitch":23.69824,"yaw":-110.94752}}},"slot":0}]},"action":""},
        {"id":"block","block":"player_action","args":{"items":[{"item":{"id":"vec","data":{"x":1.0,"y":0.1,"z":0.03}},"slot":0}]},"action":""},
        {"id":"block","block":"player_action","args":{"items":[{"item":{"id":"snd","data":{"pitch":1.0,"vol":2.0,"sound":"Pling"}},"slot":0}]},"action":""},
        // {"id":"block","block":"player_action","args":{"items":[{"item":{"id":"part","data":{"particle":"Cloud","cluster":{"amount":1,"horizontal":0.0,"vertical":0.0},"data":{"x":1.0,"y":0.0,"z":0.0,"motionVariation":100}}},"slot":0}]},"action":""},
        {"id":"block","block":"player_action","args":{"items":[{"item":{"id":"pot","data":{"pot":"Speed","dur":1000000,"amp":0}},"slot":0}]},"action":""},
        {"id":"block","block":"player_action","args":{"items":[{"item":{"id":"var","data":{"name":"hi","scope":"unsaved"}},"slot":0},{"item":{"id":"var","data":{"name":"hello","scope":"saved"}},"slot":1},{"item":{"id":"var","data":{"name":"morning","scope":"local"}},"slot":2},{"item":{"id":"var","data":{"name":"night","scope":"line"}},"slot":3}]},"action":""},
        {"id":"block","block":"player_action","args":{"items":[{"item":{"id":"g_val","data":{"type":"Player Count","target":"Default"}},"slot":0},{"item":{"id":"g_val","data":{"type":"Current Health","target":"Default"}},"slot":1}]},"action":""}]
        })
    var actiondump : ActionDump;

    var blockSize = "10em";
    var tooltipScale = "2.5";
    var slotSize = "3em";

    async function db(event: Event) {
        actiondump = ActionDump.parse(JSON.parse(await ((event.target as HTMLInputElement).files ?? [])[0].text()));
    }
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
    <br>
    <label>
        ActionDump
        <input type="file" on:change={db}/>
    </label>
</div>

<Template {stack} {openableChests} {template} {actiondump} --tooltip-scale={tooltipScale} --block-size={blockSize} --slot-size={slotSize}/>
