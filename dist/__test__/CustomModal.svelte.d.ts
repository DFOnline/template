import { SvelteComponent } from "svelte";
declare const __propDef: {
    props: {
        open?: (() => void) | undefined;
        close?: (() => void) | undefined;
    };
    events: {
        click: MouseEvent;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export type CustomModalProps = typeof __propDef.props;
export type CustomModalEvents = typeof __propDef.events;
export type CustomModalSlots = typeof __propDef.slots;
export default class CustomModal extends SvelteComponent<CustomModalProps, CustomModalEvents, CustomModalSlots> {
    get open(): () => void;
    get close(): () => void;
}
export {};
