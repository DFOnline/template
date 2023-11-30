import { SvelteComponent } from "svelte";
import { TemplateBlock, ActionDump } from 'df.ts';
import type { Openable } from './Types.js';
declare const __propDef: {
    props: {
        i: number;
        block: TemplateBlock;
        openableChests?: boolean | undefined;
        actiondump: ActionDump | undefined;
        modal: Openable;
    };
    events: {
        material: CustomEvent<MouseEvent>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type BlockProps = typeof __propDef.props;
export type BlockEvents = typeof __propDef.events;
export type BlockSlots = typeof __propDef.slots;
export default class Block extends SvelteComponent<BlockProps, BlockEvents, BlockSlots> {
}
export {};
