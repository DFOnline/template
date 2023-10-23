import { SvelteComponent } from "svelte";
import { ActionDump } from 'df.ts';
declare const __propDef: {
    props: {
        item: ArgumentItem<any>;
        actiondump?: ActionDump | undefined;
        endPoint?: URL | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type ItemProps = typeof __propDef.props;
export type ItemEvents = typeof __propDef.events;
export type ItemSlots = typeof __propDef.slots;
export default class Item extends SvelteComponent<ItemProps, ItemEvents, ItemSlots> {
}
export {};
