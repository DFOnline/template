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
export type ModalProps = typeof __propDef.props;
export type ModalEvents = typeof __propDef.events;
export type ModalSlots = typeof __propDef.slots;
export default class Modal extends SvelteComponent<ModalProps, ModalEvents, ModalSlots> {
    get open(): () => void;
    get close(): () => void;
}
export {};
