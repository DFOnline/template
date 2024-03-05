export class ContextMenu {
    items: ContextButton<ContextButtonType>[]

    constructor(...items: ContextButton<any>[]) {
        this.items = items;
    }
}

interface ContextButtonTypes {
    "button": { type: undefined, extras: { locked: boolean } }
    "checkbox": { type: boolean, extras: { locked: boolean } }
    "text": { type: string, extras: { locked: boolean, suggest: (value: string) => string[] } }
    "number": { type: number, extras: { locked: boolean, min: number, max: number } }
    "menu": { type: ContextMenu, extras: { locked: boolean } }
}
export type ContextButtonType = keyof ContextButtonTypes
export class ContextButton<T extends ContextButtonType> {
    type: T
    label: string
    value?: ContextButtonTypes[T]['type']
    update: (value: ContextButtonTypes[T]['type']) => void
    extras?: Partial<ContextButtonTypes[T]['extras']>

    constructor(type: T, label: string, update: (value: ContextButtonTypes[T]['type']) => void, value?: ContextButtonTypes[T]['type'], extras?: Partial<ContextButtonTypes[T]['extras']>) {
        this.type = type;
        this.label = label;
        this.update = update;
        this.value = value;
        this.extras = extras;
    }
}

export function combineContextMenus(...menus: ContextMenu[]): ContextMenu {
    const buttons: ContextButton<any>[] = [null as unknown as ContextButton<any>];
    menus.forEach(menu => {
        if(buttons[0] == null) {
            buttons.pop();
            buttons.push(...menu.items)
            return;
        }
        let didPair = false;
        const buttonsToRemove: number[] = [];
        buttons.forEach((button,i) => {
            menu.items.forEach(item => {
                if(button.label != item.label) return;
                didPair = true;
                if(button.type != item.type) {buttonsToRemove.push(i); return;}
                if(button.value != item.value) buttons[i].value = undefined;
                const update = buttons[i].update;
                buttons[i].update = value => {update(value); item.update(value); }
            });
            if(!didPair) buttonsToRemove.push(i);
        });
        new Set(buttonsToRemove.sort((a,b) => b-a)).forEach(i => buttons.splice(i,1));
    });
    return new ContextMenu(...buttons);
}