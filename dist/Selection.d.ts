export interface SelectionRules {
    direction: "horizontal" | "vertical";
    allowRange: boolean;
    allowMulti: boolean;
    allowChange: boolean;
}
export declare class Selection {
    cursor: number;
    rules: SelectionRules;
    updateRules(rules: Partial<SelectionRules>): this;
    constructor(cursor: number);
    getSelected(): number[];
    isSelected(index: number): boolean;
    click(event: MouseEvent, clicked: number): Selection;
    keyPress(event: KeyboardEvent, size?: number): Selection | void;
    getNewCursor(event: KeyboardEvent, size?: number): number;
}
/**
 * A selection which has nothing selected.
 * Still has a cursor, even if invisible.
 */
export declare class SelectionEmpty extends Selection {
    constructor();
    constructor(cursor: number);
    getSelected(): number[];
    isSelected(index: number): boolean;
}
/**
 * Inclusive selection range.
 */
export declare class SelectionRange extends Selection {
    start: number;
    /**
     * Inclusive
     */
    constructor(cursor: number, start: number);
    getSelected(): number[];
    click(event: MouseEvent, clicked: number): Selection;
    keyPress(event: KeyboardEvent, size?: number): Selection | void;
}
export declare class SelectionMulti extends Selection {
    selected: Set<number>;
    constructor(cursor: number, selected: number[]);
    constructor(cursor: number, selected: Set<number>);
    click(event: MouseEvent, clicked: number): Selection;
    getSelected(): number[];
}
