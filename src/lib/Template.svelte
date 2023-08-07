<script lang="ts">
    import { ActionBlock, Argument, ArgumentBlock, Arguments, Block, Bracket, DataBlock, idToName, Variable, type Template, Named } from 'df.ts'
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
        if(event.target instanceof HTMLDialogElement) {
            event.target.close();
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
                        {#if block instanceof ArgumentBlock}
                            <span class={`chest ${openableChests ? 'clickable' : ''}`} on:click={openableChests ? chestClick : undefined} on:keydown={openableChests ? chestClick : undefined} role="button" tabindex=0>
                                {#if openableChests}
                                    <dialog style="cursor: auto;">
                                        <div>
                                            <h1>{idToName.get(block.block)} {#if (block instanceof DataBlock || block instanceof ActionBlock)} {block.secondLine}{/if}</h1>
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
                                                                            <br> {item.item.data.scope}
                                                                        {/if}
                                                                    </span>
                                                                </div>
                                                            {/if}
                                                        </td>
                                                    {/each}
                                            </table>
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
        height: 20em;
        display: flex;
    }

    .left {
        height: 20em;
        width: 10em;
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
        height: 10em;
        width: 10em;
        background-image: url('./media/blocks/stone.png');
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center bottom;
        margin-top: 10em;
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
        margin-top: 10em;
        height: 10em;
        width: 10em;
        align-content: center;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
    }
    .close {
        margin-left: 10em;
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
        padding: none;
        background: none;
        border: none;
        padding: 0;
    }

    dialog > div {
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
    }

    .slot {
        aspect-ratio: 1;
        outline: 2px solid black;
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
        padding: calc(var(--tooltip-size,2) * 1px);
        font-family: 'Minecraft';
        font-size: calc(var(--tooltip-size,2) * 0.5em);
        color: white;
        background-color: #100010f0;
        border: solid calc(var(--tooltip-size,2) * 1px);
        border-image: linear-gradient(#5000FF50, #28007f50) var(--tooltip-size,2);
        border-radius: calc(var(--tooltip-size,2) * 1px);
        outline: #100010f0 calc(var(--tooltip-size,2) * 1px);
        z-index: 1;
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
</style>