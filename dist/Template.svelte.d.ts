import { SvelteComponent } from "svelte";
import { ActionDump } from 'df.ts';
declare const __propDef: {
    props: {
        template: Template;
        actiondump?: ActionDump | undefined;
        /**
             * If blocks in brackets should be shifted.
             */ stack?: boolean | undefined;
        /**
             * Allows disbaling of opening chests.
             */ openableChests?: boolean | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type TemplateProps = typeof __propDef.props;
export type TemplateEvents = typeof __propDef.events;
export type TemplateSlots = typeof __propDef.slots;
export default class Template extends SvelteComponent<TemplateProps, TemplateEvents, TemplateSlots> {
}
export {};
