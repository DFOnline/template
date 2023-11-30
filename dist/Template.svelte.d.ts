import { SvelteComponent } from "svelte";
import { ActionDump, type Template } from 'df.ts';
import { Selection } from './Selection.js';
import type { Openable } from './Types.js';
declare const __propDef: {
    props: {
        template: Template;
        selection?: Selection | undefined;
        actiondump?: ActionDump | undefined;
        modal: Openable;
        context: Openable;
        /**
             * If blocks in brackets should be shifted.
             */ stack?: boolean | undefined;
        /**
             * Allows disabling of opening chests.
             */ openableChests?: boolean | undefined;
        /**
             * Allows selecting code
             */ selectable?: boolean | undefined;
        /**
             * Allow editing code
             */ editable?: boolean | undefined;
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
