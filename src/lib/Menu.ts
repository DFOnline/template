import type { ComponentType, SvelteComponent } from "svelte";

export type ModalComponent = SvelteComponent & {open: (event?: MouseEvent) => void, close: () => void};
export type ModalComponentType = ComponentType<ModalComponent>;