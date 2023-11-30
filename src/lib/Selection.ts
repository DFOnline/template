export interface SelectionRules {
    direction: "horizontal" | "vertical";
    allowRange: boolean;
    allowMulti: boolean;
    allowChange: boolean;
}
function getButtons(rules: SelectionRules['direction']) {
    return [...rules == 'vertical' ? ['ArrowUp','ArrowDown'] as const : ['ArrowLeft','ArrowRight'] as const,'Home','End'] as const
}

export class Selection {
    cursor: number;
    rules: SelectionRules = {
        direction: 'horizontal',
        allowRange: true,
        allowMulti: true,
        allowChange: true,
    }

    updateRules(rules: Partial<SelectionRules>) {
        this.rules = {...this.rules, ...rules};
        return this;
    }

    constructor(cursor: number) {
        this.cursor = cursor;
    }

    getSelected(): number[] {
        return [this.cursor];
    }

    isSelected(index: number) {
        return this.getSelected().includes(index);
    }

    click(event: MouseEvent, clicked: number) : Selection {
        if(!this.rules.allowRange) return this;
        if(event.shiftKey && this.rules.allowRange) return new SelectionRange(clicked,this.cursor);
        else if(event.altKey && this.rules.allowMulti) return new SelectionMulti(clicked,[this.cursor,clicked]);
        return new Selection(clicked);
    }

    keyPress(event: KeyboardEvent, size = Infinity) : Selection | void {
        if(!this.rules.allowChange) return;
        const buttons = getButtons(this.rules.direction);
        if(!buttons.includes(event.key as any)) return;
        event.preventDefault();
        const point = this.getNewCursor(event,size);
        if(event.shiftKey && this.rules.allowRange) return new SelectionRange(point,this.cursor);
        return new Selection(point);
    }

    getNewCursor(event: KeyboardEvent, size = Infinity) {
        const buttons = getButtons(this.rules.direction);
        let point = this.cursor;
        const back = buttons[0];
        const next = buttons[1];
        const home = buttons[2];
        const end = buttons[3];
        if(event.key == back || event.key == next) point = this.cursor + (event.key == next ? 1 : -1);
        if(event.key == home) point = 0;
        if(event.key == end && size != Infinity) point = size;
        return Math.min(Math.max(0,point),size - 1);
    }
}

/**
 * A selection which has nothing selected. 
 * Still has a cursor, even if invisible.
 */
export class SelectionEmpty extends Selection {
    constructor()
    constructor(cursor :number)
    constructor(cursor?:number) {
        super(cursor ?? 0);
    }

    getSelected(): number[] {
        return [];
    }

    isSelected(index: number): boolean {
        return false;
    }
}

/**
 * Inclusive selection range.
 */
export class SelectionRange extends Selection {
    start: number = 0;

    /**
     * Inclusive
     */
    constructor(cursor: number, start: number) {
        super(cursor);
        this.start = start;
    }

    getSelected(): number[] {
        const min = Math.min(this.start,this.cursor);
        return [...Array(Math.abs(this.cursor-this.start)+1).keys()].map(num => num + min);
    }

    click(event: MouseEvent, clicked: number): Selection {
        if(event.shiftKey) return new SelectionRange(clicked,this.start);
        else if (event.altKey) {
            const selection = new SelectionMulti(this.cursor,this.getSelected());
            return selection.click(event,clicked);
        }
        else return super.click(event,clicked);
    }

    keyPress(event: KeyboardEvent, size = Infinity): Selection | void {
        if(!event.shiftKey) return super.keyPress(event,size);
        const point = this.getNewCursor(event,size);
        return new SelectionRange(point,this.start) 
    }
}

export class SelectionMulti extends Selection {
    selected: Set<number>
    
    constructor(cursor: number, selected: number[])
    constructor(cursor: number, selected: Set<number>)
    constructor(cursor: number, selected: number[] | Set<number>) {
        super(cursor);
        this.selected = selected instanceof Array ? new Set(selected) : selected;
    }

    click(event: MouseEvent, clicked: number): Selection {
        if(!event.altKey) return super.click(event,clicked);
        this.selected.add(this.cursor);
        if(this.selected.has(clicked)) this.selected.delete(clicked)
        else this.selected.add(clicked);
        return new SelectionMulti(clicked, this.selected);
    }

    getSelected(): number[] {
        // Wrapped in [...Set(-)] to make sure the cursor doesn't duplicate anything
        return [...new Set([this.cursor, ...this.selected])];
    }
}