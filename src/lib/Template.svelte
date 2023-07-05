<script lang="ts">
    import { ArgumentBlock, Block, Bracket, type Template } from 'df.ts'

    export let template: Template;
</script>

<ul>
    {#each template.blocks as block}
        <li>
            {#if block instanceof Bracket}
                {block.direct} {block.type}
            {/if}
            {#if block instanceof Block}
                <div class="left">
                    <div class="top">
                        {#if block instanceof ArgumentBlock}
                            <span class="chest"></span>
                        {/if}
                    </div>
                    <div class="material">
                        <div class="sign">
                            <span>
                                {block.block}
                            </span>
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
                    <span class="right"></span>
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
        list-style: none;
    }

    li {
        height: 20em;
        width: 20em;
        aspect-ratio: 1;
        display: grid;
        grid-template-columns: 50% 50%;
        grid-template-rows: 100%;
    }

    .left {
        display: grid;
        grid-template-rows: 50% 50%;
    }

    .material {
        display: flex;
        align-content: center;
        background-image: url('./media/blocks/event.png');
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

    .right {
        margin-top: 100%;
        background-image: url('./media/blocks/stone.png');
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center bottom;
    }
</style>