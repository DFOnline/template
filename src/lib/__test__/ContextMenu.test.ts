import { describe, test, expect, mock } from 'bun:test'
import { ContextButton, ContextMenu, combineContextMenus } from '$lib/ContextMenu.js'

describe("Context Menus", () => {
    const n = () => {}
    test("Common Buttons", () => {
        const buttonA = new ContextButton('button','buttonA',n);
        const buttonB = new ContextButton('button','buttonB',n);
        const buttonC = new ContextButton('button','buttonC',n);

        const A = new ContextMenu(buttonA,buttonB);
        const B = new ContextMenu(buttonB,buttonC);

        const expectedResult = new ContextMenu(buttonB);
        
        expect(combineContextMenus(A,B)).toStrictEqual(expectedResult)
    });
    test("Combine Values", () => {
        const inputA1 = new ContextButton('input','inputA',n,'0');
        const inputB1 = new ContextButton('input','inputB',n,'1');
        const inputB2 = new ContextButton('input','inputB',n,'2');

        const A = new ContextMenu(inputA1,inputB1);
        const B = new ContextMenu(inputA1,inputB2);

        const expectedB = new ContextButton('input','inputB',n,undefined);
        const expectedResult = new ContextMenu(inputA1,expectedB);

        expect(combineContextMenus(A,B).items.map(i => [i.label,i.type,i.value])).toEqual(expectedResult.items.map(i => [i.label,i.type,i.value]));
    });
    test("All Callbacks", () => {
        const mockA = mock();
        const mockB = mock();
        const versionA = new ContextButton('button','',mockA);
        const versionB = new ContextButton('button','',mockB);

        const A = new ContextMenu(versionA);
        const B = new ContextMenu(versionB);

        combineContextMenus(A,B).items[0].update('');

        expect(mockA).toHaveBeenCalled();
        expect(mockB).toHaveBeenCalled();
    });
})