<script lang="ts">
    import { Argument, Named, Location, Vector, Sound, Potion, GameValue, MinecraftItem } from 'df.ts'
    import ColoredText from './ColoredText.svelte';
    import { parse } from 'nbt-ts'

    export let item: Argument;
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

    const scopeToName : Record<string, string> = {
        'local': 'LOCAL',
        'unsaved': 'GAME',
        'saved': 'SAVE',
    }

    const targetToColor : Record<string, string> = {
        'Selection': 'green',
        'Default': 'green',
        'Killer': 'red',
        'Damager': 'red',
        'Victim': 'blue',
        'Shooter': 'yellow',
        'Projectile': 'aqua',
        'LastEntity': 'yellow'
    }

    let parsed : any = null;
    if(item.item instanceof MinecraftItem) {
        parsed = parse(item.item.data.item)
    }
</script>

    <div class={`item ${item.item.id}`} style={item.item instanceof MinecraftItem ? `background-image: url(${endPoint}/${parsed.id.split(':')[1].toUpperCase()}.png)` : undefined}>
        <span class="tooltip">
            {#if item.item instanceof MinecraftItem}
                {JSON.stringify(parsed)}
            {/if}
            {#if item.item instanceof Named}
                <ColoredText text={item.item.data.name} />
            {/if}
            {#if item.item.id == 'var'}
                <br> <span class={item.item.data.scope}>{scopeToName[item.item.data.scope]}</span>
            {/if}
            {#if item.item instanceof Location}
                <span class="green">Location</span>
                <br> <span class="lg">X: </span> <span>{numberDigits(item.item.data.loc.x)}</span>
                <br> <span class="lg">Y: </span> <span>{numberDigits(item.item.data.loc.y)}</span>
                <br> <span class="lg">Z: </span> <span>{numberDigits(item.item.data.loc.z)}</span>
                {#if !item.item.data.isBlock}
                    <br> <span class="lg">p: </span> <span>{numberDigits(item.item.data.loc.pitch ?? 0)}</span>
                    <br> <span class="lg">y: </span> <span>{numberDigits(item.item.data.loc.yaw ?? 0)}</span>
                {/if}
            {/if}
            {#if item.item instanceof Vector}
                <span class="vector">Vector</span>
                <br> <span class="lg">X: </span> <span>{numberDigits(item.item.data.x)}</span>
                <br> <span class="lg">Y: </span> <span>{numberDigits(item.item.data.y)}</span>
                <br> <span class="lg">Z: </span> <span>{numberDigits(item.item.data.z)}</span>
            {/if}
            {#if item.item instanceof Sound}
                <span class="blue">Sound</span>
                <br> <span>{item.item.data.sound}</span>
                <br>
                <br> <span class="lg">Pitch: </span> <span>{item.item.data.pitch}</span>
                <br> <span class="lg">Volume: </span> <span>{item.item.data.vol}</span>
            {/if}
            {#if item.item instanceof Potion}
                <span class="pot">Potion</span>
                <br> <span>{item.item.data.pot}</span>
                <br>
                <br> <span class="lg">Amplifier: </span> <span>{item.item.data.amp + 1}</span>
                <br> <span class="lg">Duration: </span> <span>{item.item.data.dur >= 1000000 ? 'Infinite' : (item.item.data.dur % 20 == 0 ? `${Math.floor((item.item.data.dur / 20) / 60)}:${String((item.item.data.dur / 20) % 60).padStart(2, '0')}` : `${item.item.data.dur} ticks`)}</span>
            {/if}
            {#if item.item instanceof GameValue}
                <span>{item.item.data.type}</span>
                <br>
                <span class={targetToColor[item.item.data.target ?? 'Default']}>{item.item.data.target == 'LastEntity' ? 'Last-Spawned Entity' : item.item.data.target}</span>
            {/if}
        </span>
    </div>

<style>
    .item {
        position: relative;
        background-size: cover;
        height: 100%;
        widows: 100%;
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
    .num {background-image: url(./media/items/num.png);}
    .var {background-image: url(./media/items/var.png);}
    .snd {background-image: url(./media/items/snd.png);}
    .pot {background-image: url(./media/items/pot.png);}
    .loc {background-image: url(./media/items/loc.png);}
    .vec {background-image: url(./media/items/vec.png);}
    .part {background-image: url(./media/items/part.png);}
    .g_val {background-image: url(./media/items/g_val.png);}

    .green,
    .local {
        color: #5F5;
    }

    .light_gray,
    .lg,
    .unsaved {
        color: #AAA;
    }

    .yellow,
    .saved {
        color: #FF5;
    }

    .red {
        color: #F55;
    }
    
    .blue {
        color: #55F;
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
</style>