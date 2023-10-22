import { SvelteComponent } from "svelte";
declare const __propDef: {
    props: {
        text: string;
        defaultStyle?: {
            color?: string | undefined;
            italic?: boolean | undefined;
            bold?: boolean | undefined;
            strikethrough?: boolean | undefined;
            obfuscated?: boolean | undefined;
            underlined?: boolean | undefined;
        } | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type ColoredTextProps = typeof __propDef.props;
export type ColoredTextEvents = typeof __propDef.events;
export type ColoredTextSlots = typeof __propDef.slots;
export default class ColoredText extends SvelteComponent<ColoredTextProps, ColoredTextEvents, ColoredTextSlots> {
}
export {};
