<script lang="ts">
    import { Argument, Location, Vector, Sound, Potion, GameValue, MinecraftItem, BlockTag, ActionDump, Component, Variable, Parameter, Text, Hint, Number, ArgumentItem } from 'df.ts'
    import ColoredText from './ColoredText.svelte';
    import { parse } from 'nbt-ts'
	import type { Tag } from 'df.ts/lib/actiondump/action.js';

    export let item: ArgumentItem<any>;
    export let actiondump: ActionDump | undefined = undefined;
    export let endPoint = new URL('https://dfonline.dev/public/images');

    /**
     * How df shows numbers in various values.
     * Examples are:
     * 0   : 0.0
     * 1.5 : 1.5
     * 1.25: 1.25
     */
     function numberDigits(number : number) : string {
        return number.toFixed(2).replace(/0$/,'')
    }

    const scopeToName = {
        'local': 'LOCAL',
        'unsaved': 'GAME',
        'saved': 'SAVE',
        'line': 'LINE',
    } as const

    const targetToColor = {
        'Selection': 'green',
        'Default': 'green',
        'Killer': 'red',
        'Damager': 'red',
        'Victim': 'blue',
        'Shooter': 'yellow',
        'Projectile': 'aqua',
        'LastEntity': 'yellow'
    } as const

    let customIcon : string | undefined;

    let parsed : any = null;
    if(item instanceof MinecraftItem) {
        parsed = parse(item.data.item)
        customIcon = parsed.id.split(':')[1].toUpperCase();
    }

    let tag: Tag | undefined;
    if(item instanceof BlockTag) {
        // TODO: check codeblock, not just action
        tag = (actiondump?.actions.find(a => item instanceof BlockTag && a.name == item.data.action)?.tags ?? []).find(t => item instanceof BlockTag && t.name == item.data.tag);
        customIcon = tag?.options.find(o => item instanceof BlockTag && item.data.option == o.name)?.icon.material;
    }
</script>

    <div class={`item ${item.id}`} style={customIcon != null ? `background-image: url(${endPoint}/${customIcon}.png)` : undefined}>
        <span class="tooltip">
            {#if item instanceof MinecraftItem}
                {JSON.stringify(parsed)}
            {/if}
            {#if item instanceof BlockTag}
                <span class="yellow">Tag: {item.data.tag}</span>
                <br>
                {#if actiondump != null}
                    {#each tag?.options ?? [] as option}
                    <br>
                        <span class={item.data.option == option.name ? 'aqua' : 'lg'}>{#if item.data.option == option.name}<span class="cyan">»</span> {/if}{option.name}</span>
                    {/each}
                {/if}
                {#if actiondump == null}
                    <span class="aqua"><span class="cyan">»</span> {item.data.option}</span>
                {/if}
            {/if}
            {#if item instanceof Text}
                <span>{item.data.name}</span>
            {/if}
            {#if item instanceof Component}
                <!-- TODO: Minimessage. Fonts sound like a pain. -->
                <span>{item.data.name}</span>
            {/if}
            {#if item instanceof Number}
                <span class="red">{item.data.name}</span>
            {/if}
            {#if item instanceof Variable}
                <span class="yellow">{item.data.name}</span>
                <br> <span class={item.data.scope}>{scopeToName[item.data.scope]}</span>
            {/if}
            {#if item instanceof Parameter}
                <span class="param">{item.data.name}</span> <br>
                <span class="dg"><span class={item.data.type}>{item.data.type}</span> - <span class="lg">{item.data.description ?? item.data.name}</span></span> <br>
                {#if item.data.default_value != null}
                    <span class="lg"><span class="blue">⏵</span> Default = <span style="width: 100px; height: 100px; display: block;"> <svelte:self item={item.data.default_value} {actiondump} {endPoint}></svelte:self> </span> </span>
                {/if}
            {/if}
            {#if item instanceof Location}
                <span class="green">Location</span>
                <br> <span class="lg">X: </span> <span>{numberDigits(item.data.loc.x)}</span>
                <br> <span class="lg">Y: </span> <span>{numberDigits(item.data.loc.y)}</span>
                <br> <span class="lg">Z: </span> <span>{numberDigits(item.data.loc.z)}</span>
                {#if !item.data.isBlock}
                    <br> <span class="lg">p: </span> <span>{numberDigits(item.data.loc.pitch ?? 0)}</span>
                    <br> <span class="lg">y: </span> <span>{numberDigits(item.data.loc.yaw ?? 0)}</span>
                {/if}
            {/if}
            {#if item instanceof Vector}
                <span class="vector">Vector</span>
                <br> <span class="lg">X: </span> <span>{numberDigits(item.data.x)}</span>
                <br> <span class="lg">Y: </span> <span>{numberDigits(item.data.y)}</span>
                <br> <span class="lg">Z: </span> <span>{numberDigits(item.data.z)}</span>
            {/if}
            {#if item instanceof Sound}
                <span class="blue">Sound</span>
                <br> <span>{item.data.sound}</span>
                <br>
                <br> <span class="lg">Pitch: </span> <span>{item.data.pitch}</span>
                <br> <span class="lg">Volume: </span> <span>{item.data.vol}</span>
            {/if}
            {#if item instanceof Potion}
                <span class="pot">Potion</span>
                <br> <span>{item.data.pot}</span>
                <br>
                <br> <span class="lg">Amplifier: </span> <span>{item.data.amp + 1}</span>
                <br> <span class="lg">Duration: </span> <span>{item.data.dur >= 1000000 ? 'Infinite' : (item.data.dur % 20 == 0 ? `${Math.floor((item.data.dur / 20) / 60)}:${String((item.data.dur / 20) % 60).padStart(2, '0')}` : `${item.data.dur} ticks`)}</span>
            {/if}
            {#if item instanceof GameValue}
                <span>{item.data.type}</span>
                <br>
                <span class={targetToColor[item.data.target ?? 'Default']}>{item.data.target == 'LastEntity' ? 'Last-Spawned Entity' : item.data.target}</span>
            {/if}
            {#if item instanceof Hint}
                <span class="hint-green">Hint: {#if item.data.id == 'function'}Function Parameters{:else}Invalid Hint{/if}</span>
                {#if item.data.id == 'function'}
                    <p class="lg">
                    Put <span class="param">Parameter</span> items in this chest to set <br>
                    the parameters of this function. <br>
                    <br>
                    In this code line, use the <span class="line">LINE</span> variable <br>
                    scope to access the parameter values. <br>
                    <br>
                    <span class="LINE">LINE</span> variable items for each parameter <br>
                    can be obtained by right clicking on a <br>
                    <span class="param">Parameter</span> item in this chest.
                    </p>
                {:else}
                    <span class="lg">Hint data was not found.</span>
                    <span style="font-family: monospace;" class="dg">(id: {item.data.id})</span>
                {/if}
                <br><span class="dg">Shift-Click to remove hint</span>
            {/if}
        </span>
    </div>

<style>
    p {
        margin: 0;
        padding: 0;
    }
    .item {
        position: relative;
        background-size: cover;
        height: 100%;
        widows: 100%;
        background-image: url(./media/items/invalid.png)
    }
    .item .tooltip {
        visibility: hidden;
        position: absolute;
        top: 50%;
        left: 50%;
        width: max-content;
        padding: calc(var(--tooltip-scale,2) * 1px);
        font-family: 'Minecraft';
        font-size: calc(var(--tooltip-scale,2) * 0.5em);
        color: white;
        background-color: #100010f0;
        border: solid calc(var(--tooltip-scale,2) * 1px);
        border-image: linear-gradient(#5000FF50, #28007f50) var(--tooltip-scale,2);
        border-radius: calc(var(--tooltip-scale,2) * 1px);
        outline: #100010f0 calc(var(--tooltip-scale,2) * 2px);
        z-index: 100;
        user-select: none;
        pointer-events: none;
    }
    .item:hover .tooltip {
        visibility: visible;
    }
    
    .txt {background-image: url(./media/items/txt.png);}
    .comp {background-image: url(./media/items/comp.png);}
    .num {background-image: url(./media/items/num.png);}
    .var {background-image: url(./media/items/var.png);}
    .snd {background-image: url(./media/items/snd.png);}
    .pot {background-image: url(./media/items/pot.png);}
    .loc {background-image: url(./media/items/loc.png);}
    .vec {background-image: url(./media/items/vec.png);}
    .part {background-image: url(./media/items/part.png);}
    .g_val {background-image: url(./media/items/g_val.png);}
    .pn_el {background-image: url(./media/items/pn_el.png);}
    .hint {background-image: url(./media/items/hint.png);}

    .green,
    .local {
        color: #5F5;
    }

    .light_gray,
    .lg,
    .unsaved {
        color: #AAA;
    }
    .dark_gray,
    .dg {
        color: #555;
    }

    .yellow,
    .saved {
        color: #FF5;
    }

    .line {
        color: #5AF;
    }

    .red {
        color: #F55;
    }
    
    .blue {
        color: #55F;
    }

    .cyan {
        color: #0AA;
    }

    .aqua {
        color: #5FF;
    }

    .vector {
        color: #2AFFAA;
    }

    .pot, .potion {
        color: #FF557F;
    }

    .pn_el, .param {
        color: #AFA;
    }
    .hint-green {
        color: #af5
    }
</style>