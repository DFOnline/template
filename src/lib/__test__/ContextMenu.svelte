<script lang="ts">
    let show = false;
    let context : HTMLDivElement;

    export function open() {
        show = true;
        setTimeout(() => {
            context.focus();
        });
    }
    export function close() {
        show = false;
    }

    function unfocus(event: FocusEvent) {
        if(!context.contains(event?.relatedTarget as Node)) close();
    }
</script>

<svelte:window on:scroll={close} />
{#if show}
    <div bind:this={context} on:keydown on:keypress on:keyup on:focusout={unfocus} role="toolbar" tabindex="0">
        <slot />
    </div>
{/if}

<style>
    div {
        position: fixed;
    }
</style>