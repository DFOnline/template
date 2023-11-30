import type { ComponentType, SvelteComponent } from "svelte"

export interface Openable extends ComponentType<any> {
    open(): void;
    close(): void;
}