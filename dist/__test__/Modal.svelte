<script>let dialog;
export function open() {
  dialog.showModal();
}
export function close() {
  dialog.close();
}
</script>
<dialog bind:this={dialog} on:click={close}>
    <div on:click|stopPropagation tabindex="-1" role="button">
        <slot />
    </div>
</dialog>

<style>
    dialog {
        padding: 0;
        background: none;
        border: none;
    }
    ::backdrop {
        background-color: #0005;
    }

    div {
        padding: 1em;
        background-color: white;
        border: 5px solid black;
    }
</style>