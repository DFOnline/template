export class Selection {
    cursor: number;

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
        if(event.shiftKey) return new SelectionRange(clicked,this.cursor);
        else if(event.altKey) return new SelectionMulti(clicked,[this.cursor,clicked]);
        return new Selection(clicked);
    }

    keyPress(event: KeyboardEvent, size = Infinity) : Selection {
        if(event.key != 'ArrowLeft' && event.key != 'ArrowRight') return this;
        event.preventDefault();
        const point = this.getNewCursor(event,size);
        console.log(point)
        if(event.shiftKey) return new SelectionRange(point,this.cursor);
        return new Selection(point);
    }

    getNewCursor(event: KeyboardEvent, size = Infinity) {
        let point = this.cursor;
        if(event.key == 'ArrowLeft' || event.key == 'ArrowRight') point = this.cursor + (event.key == 'ArrowRight' ? 1 : -1);
        if(event.key == 'Home') this.cursor = 0;
        if(event.key == 'End' && size != Infinity) point = size;
        return Math.min(Math.max(0,point),size - 1);
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

    keyPress(event: KeyboardEvent, size = Infinity): Selection {
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
        return [this.cursor, ...this.selected];
    }
}