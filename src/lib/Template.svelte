<script lang="ts">
    import { ActionBlock, Argument, ArgumentBlock, Arguments, Block, Bracket, DataBlock, idToName, type Template, Named, Location, Vector, Sound, Potion, GameValue } from 'df.ts'
	import ColoredText from './ColoredText.svelte';

    export let template: Template;
    /**
     * If blocks in brackets should be shifted.
     */
    export let stack: boolean = false;
    /**
     * Allows disbaling of opening chests.
     */
    export let openableChests: boolean = true;

    let stackList : number[];
    if(stack) {
        let i : number = 0;
        stackList = template.blocks.map((block) => {
            if(block instanceof Bracket) {
                if(block.direct == 'open') {
                    const old = i;
                    i++;
                    return old;
                }
                if(block.direct == 'close') {
                    i--;
                }
            }
            return i;
        })
    }

    function chestClick(event : MouseEvent|KeyboardEvent) {
        if(event.target instanceof HTMLElement) {
            let diag = event.target.classList.contains('bg') ? event.target.parentElement : event.target
            if(diag instanceof HTMLDialogElement) {
                diag.close();
            }
        }
        if((event.target as HTMLElement).classList.contains('chest')) {
            if(event instanceof KeyboardEvent) {
                if(!(event.key === 'Enter' || event.key === ' ')) {
                    return;
                }
            }
            ((event.target as HTMLSpanElement).querySelector('dialog') as HTMLDialogElement).showModal()
        }
    }

    // TODO: move this in to df.ts Arguments
    function sortInventory(items?: Arguments) : (Argument | undefined)[] {
        const sorted = new Array(9*3);
        items?.items.forEach(item => {
            sorted[item.slot] = Argument.parse(item);
        });
        return sorted;
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

    /**
     * How df shows numbers in locations.
     * Examples are:
     * 0   : 0.0
     * 1.5 : 1.5
     * 1.25: 1.25
     */
    function numberDigits(number : number) : string {
        return number.toFixed(2).replace(/0$/,'')
    }
</script>

<ul>
    {#each template.blocks as block, i}
        <li style={stack ? `padding-top: ${stackList[i] * 1.25}em;` : undefined}>
            {#if block instanceof Bracket}
                <div class={`bracket ${block.direct} ${block.type}`}></div>
            {/if}
            {#if block instanceof Block}
                <div class="left">
                    <div class="top">
                        {#if block instanceof ArgumentBlock && block.block != 'call_func' && !block.block.includes('event')}
                            <span class={`chest ${openableChests ? 'clickable' : ''}`} on:click={openableChests ? chestClick : undefined} on:keydown={openableChests ? chestClick : undefined} role="button" tabindex=0>
                                {#if openableChests}
                                    <dialog style="cursor: auto;">
                                        <div class="bg">
                                            <div>
                                                <h1>{i + 1}: {idToName.get(block.block)} {#if (block instanceof DataBlock || block instanceof ActionBlock)} {block.secondLine}{/if}</h1>
                                                <table>
                                                        {#each sortInventory(block.args) as item}
                                                            <td class={`slot`}>
                                                                {#if item != null}
                                                                    <div class={`item ${item.item.id}`}>
                                                                        <span class="tooltip">
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
                                                                                <br> <span class="lg">Amplifier: </span> <span>{item.item.data.amp.toFixed(0)}</span>
                                                                                <br> <span class="lg">Duration: </span> <span>{item.item.data.dur >= 1000000 ? 'Infinite' : (item.item.data.dur % 20 == 0 ? `${Math.floor((item.item.data.dur / 20) / 60)}:${String((item.item.data.dur / 20) % 60).padStart(2, '0')}` : `${item.item.data.dur} ticks`)}</span>
                                                                            {/if}
                                                                            {#if item.item instanceof GameValue}
                                                                                <span>{item.item.data.type}</span>
                                                                                <br>
                                                                                <span class={targetToColor[item.item.data.target ?? 'Default']}>{item.item.data.target == 'LastEntity' ? 'Last-Spawned Entity' : item.item.data.target}</span>
                                                                            {/if}
                                                                        </span>
                                                                    </div>
                                                                {/if}
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
                    <div class={`material ${block.block}`}>
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
        </li>
    {/each}
</ul>

<style>
    @font-face {
        src: url('./media/MinecraftRegular-Bmg3.otf');
        font-family: 'Minecraft';
    }

    ul {
        padding: 0;
        margin: 0;
        list-style: none;
        display: flex;
    }

    li {
        height: calc(var(--block-size,var(--block-size,10em)) * 2);
        display: flex;
    }

    .left {
        height: calc(var(--block-size,var(--block-size,10em)) * 2);
        width: var(--block-size,10em);
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
        font-size: calc(var(--block-size,10em) / 10);
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
        height: var(--block-size,10em);
        width: var(--block-size,10em);
        background-image: url('./media/blocks/stone.png');
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center bottom;
        margin-top: var(--block-size,10em);
    }

    /* I recognise this from somewhere */
    .event         { background-image: url( ./media/blocks/event.png         );}
    .player_action { background-image: url( ./media/blocks/player_action.png );}
    .if_player     { background-image: url( ./media/blocks/if_player.png     );}
    .process       { background-image: url( ./media/blocks/process.png       );}
    .start_process { background-image: url( ./media/blocks/start_process.png );}
    .func          { background-image: url( ./media/blocks/func.png          );}
    .call_func     { background-image: url( ./media/blocks/call_func.png     );}
    .entity_event  { background-image: url( ./media/blocks/entity_event.png  );}
    .entity_action { background-image: url( ./media/blocks/entity_action.png );}
    .if_entity     { background-image: url( ./media/blocks/if_entity.png     );}
    .if_var        { background-image: url( ./media/blocks/if_var.png        );}
    .set_var       { background-image: url( ./media/blocks/set_var.png       );}
    .if_game       { background-image: url( ./media/blocks/if_game.png       );}
    .game_action   { background-image: url( ./media/blocks/game_action.png   );}
    .repeat        { background-image: url( ./media/blocks/repeat.png        );}
    .control       { background-image: url( ./media/blocks/control.png       );}
    .select_obj    { background-image: url( ./media/blocks/select_obj.png    );}
    .else          { background-image: url( ./media/blocks/else.png          );}

    .bracket {
        margin-top: var(--block-size,10em);
        height: var(--block-size,10em);
        width: var(--block-size,10em);
        align-content: center;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
    }
    .close {
        margin-left: var(--block-size,10em);
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
        width: var(--slot-size,auto);
    }
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