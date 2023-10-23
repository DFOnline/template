<script lang="ts">
    import { ActionBlock, ActionDump, Argument, ArgumentBlock, Arguments, Block, Bracket, DataBlock, idToName, type Template as DFTemplate } from 'df.ts'
	import Item from './Item.svelte';

    export let template: DFTemplate;
    export let actiondump: ActionDump | undefined = undefined;
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
                                                                {#if item != null}<Item item={item.item} {actiondump}/>{/if}
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
        src: url('/MinecraftRegular-Bmg3.otf');
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
        background-image: url('/blocks/sign.png');
        background-size: contain;
    }

    .top {
        display: grid;
    }

    .chest {
        background-image: url('/blocks/chest.png');
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
        background-image: url('/blocks/stone.png');
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center bottom;
        margin-top: var(--block-size,10em);
    }

    /* I recognise this from somewhere */
    .event         { background-image: url( /blocks/event.png         );}
    .player_action { background-image: url( /blocks/player_action.png );}
    .if_player     { background-image: url( /blocks/if_player.png     );}
    .process       { background-image: url( /blocks/process.png       );}
    .start_process { background-image: url( /blocks/start_process.png );}
    .func          { background-image: url( /blocks/func.png          );}
    .call_func     { background-image: url( /blocks/call_func.png     );}
    .entity_event  { background-image: url( /blocks/entity_event.png  );}
    .entity_action { background-image: url( /blocks/entity_action.png );}
    .if_entity     { background-image: url( /blocks/if_entity.png     );}
    .if_var        { background-image: url( /blocks/if_var.png        );}
    .set_var       { background-image: url( /blocks/set_var.png       );}
    .if_game       { background-image: url( /blocks/if_game.png       );}
    .game_action   { background-image: url( /blocks/game_action.png   );}
    .repeat        { background-image: url( /blocks/repeat.png        );}
    .control       { background-image: url( /blocks/control.png       );}
    .select_obj    { background-image: url( /blocks/select_obj.png    );}
    .else          { background-image: url( /blocks/else.png          );}

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
        background-image: url(/blocks/piston.png);
    }
    .bracket.repeat {
        background-image: url(/blocks/pistonSticky.png);
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
        min-width: 100vw;
        min-height: 100vh;
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
</style>