<script lang="ts">
	import { Selection } from "$lib/Selection.js";
    import Template from "$lib/Template.svelte";
    import { ActionDump, Template as CodeTemplate } from "df.ts";
    import Modal from '$lib/__test__/Modal.svelte';
    import CustomModal from '$lib/__test__/CustomModal.svelte';
	import type { ComponentType, SvelteComponent } from "svelte";
	import ContextMenu from "$lib/__test__/ContextMenu.svelte";
    import type { Openable } from "$lib/Types.js";

    let stack = true;
    let openableChests = true;
    let template = CodeTemplate.parse({"blocks":[
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
        });
    let selection = new Selection(0);
    let actiondump : ActionDump;

    let blockSize = "10em";
    let tooltipScale = "2.5";
    let slotSize = "3em";

    async function db(event: Event) {
        actiondump = ActionDump.parse(JSON.parse(await ((event.target as HTMLInputElement).files ?? [])[0].text()));
    }

    let myCtx : ContextMenu;
    
    let modal : Modal | CustomModal;
    let modalCheck = true;
    $: modalStyle = (modalCheck ? CustomModal : Modal) as Openable;
</script>

<h1>template demo</h1>
<p>Example page of template</p>

<div class="test">
    <p style="margin: 0;">Test Modal</p>
    <svelte:component this={modalStyle} bind:this={modal}>
        <h1>Test Modal</h1>
        <div style="display: flex">
            <button>1</button>
            <button>2</button>
            <button>3</button>
        </div>
        <button on:click={modal.close}>Close</button>
    </svelte:component>
    <label>Use Custom Model Style <input type="checkbox" bind:checked={modalCheck} /> </label>
    <button on:click={modal.open}>Open Modal</button>
</div>

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

<div class="test">
    <button on:click={myCtx.open}>Show Context Menu</button>
    <ContextMenu bind:this={myCtx}>
        <div style="height: 4em; overflow: scroll; display: grid">
            <button on:click={myCtx.close}>Save</button>
            <button on:click={myCtx.close}>Exit</button>
            <button on:click={myCtx.close}>New</button>
            <button on:click={myCtx.close}>Help</button>
            <button on:click={myCtx.close}>Uhm</button>
            <button on:click={myCtx.close}>Close</button>
        </div>
    </ContextMenu>
</div>

<Template modal={modalStyle} {stack} {openableChests} {template} {actiondump} --tooltip-scale={tooltipScale} --block-size={blockSize} --slot-size={slotSize}/>

<style>
    .test {
        margin: 0.5em;
        padding: 0.5em;
        outline: solid red 1px;
    }
</style>