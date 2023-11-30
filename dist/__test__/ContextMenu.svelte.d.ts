import { SvelteComponent } from "svelte";
declare const __propDef: {
    props: {
        open?: (() => void) | undefined;
        close?: (() => void) | undefined;
    };
    events: {
        keydown: KeyboardEvent;
        keypress: KeyboardEvent;
        keyup: KeyboardEvent;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export type ContextMenuProps = typeof __propDef.props;
export type ContextMenuEvents = typeof __propDef.events;
export type ContextMenuSlots = typeof __propDef.slots;
export default class ContextMenu extends SvelteComponent<ContextMenuProps, ContextMenuEvents, ContextMenuSlots> {
    get open(): () => void;
    get close(): () => void;
}
export {};
