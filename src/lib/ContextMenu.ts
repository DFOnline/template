export class ContextMenu {
    items: ContextButton<any>[]

    constructor(...items: ContextButton<any>[]) {
        this.items = items;
    }
}

interface ContextButtonTypes {
    "button": string
    "checkbox": boolean
    "input": string
    "menu": ContextMenu
}
export class ContextButton<T extends keyof ContextButtonTypes> {
    type: T
    label: string
    value?: ContextButtonTypes[T]
    update: (value: ContextButtonTypes[T]) => void

    constructor(type: T, label: string, update: (value: ContextButtonTypes[T]) => void, value?: ContextButtonTypes[T]) {
        this.type = type;
        this.label = label;
        this.update = update;
        this.value = value;
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