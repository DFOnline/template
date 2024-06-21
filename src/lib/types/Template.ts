import type Arguments from "./Args.js"

export default interface Template {
    blocks: BracketOrBlock[]
}

export type BracketOrBlock = Block | Bracket
export type Block = ElseBlock | SelectionBlock | SubActionBlock | DataBlock

export interface Bracket {
    id: 'bracket'
    direct: 'open' | 'close'
    type: 'norm' | 'repeat'
}
export function isBracket(block: BracketOrBlock): block is Bracket {
    return block.id == 'bracket';
}
export function isBlock(block: BracketOrBlock): block is Block {
    return block.id == 'block';
}

export interface ElseBlock {
    id: 'block'
    block: 'else'
}
export function isElse(block: BracketOrBlock): block is ElseBlock {
    return isBlock(block) && block.block == 'else';
}

type Attribute = '' | 'LS-CANCEL' | 'NOT';
const SELECTION_BLOCKS = ['event','player_action','entity_event','entity_action','set_var','game_action','control','if_entity','if_game','if_player','if_var'] as const;
export interface SelectionBlock {
    id: 'block'
    block: typeof SELECTION_BLOCKS[number]
    action: string
    attribute?: Attribute
    args: Arguments
}
export function isSelectionBlock(block: BracketOrBlock): block is SelectionBlock {
    return isBlock(block) && SELECTION_BLOCKS.includes(block.block as any);
}

const SUB_ACTION_BLOCKS = ['repeat','select_obj'] as const
export interface SubActionBlock {
    id: 'block'
    block: typeof SUB_ACTION_BLOCKS[number]
    action: string
    subAction?: string
    attribute?: Attribute
    args: Arguments
}
export function isSubActionBlock(block: BracketOrBlock): block is SubActionBlock {
    return isBlock(block) && SUB_ACTION_BLOCKS.includes(block.block as any);
}

const DATA_BLOCKS = ['func','call_func','process','start_process'] as const;
export interface DataBlock {
    id: 'block'
    block: typeof DATA_BLOCKS[number]
    data: string
    args: Arguments
}

export function isDataBlock(block: BracketOrBlock): block is DataBlock {
    return isBlock(block) && DATA_BLOCKS.includes(block.block as any);
}

export type ArgumentBlock = DataBlock | ActionBlock;
export function isArgumentBlock(block: BracketOrBlock): block is DataBlock | SelectionBlock | SubActionBlock {
    return isDataBlock(block) || isActionBlock(block);
}
export type ActionBlock = SelectionBlock | SubActionBlock;
export function isActionBlock(block: BracketOrBlock): block is ActionBlock {
    return isSelectionBlock(block) || isSubActionBlock(block)
}

const template: Template = {
    'blocks': [
        {'block': 'else', 'id':'block'}
    ]
}

const block = template.blocks[0]
if(block.id == 'bracket') {
    block.direct
    block.type
}
else if(block.id == 'block') {
    if(isSelectionBlock(block)) {
        block.block
    }
}

const defaultBlockNames : [Block['block'], String][] = [["player_action","PLAYER ACTION"],["if_player","IF PLAYER"],["start_process","START PROCESS"],["call_func","CALL FUNCTION"],["control","CONTROL"],["set_var","SET VARIABLE"],["entity_event","ENTITY EVENT"],["event","PLAYER EVENT"],["func","FUNCTION"],["if_entity","IF ENTITY"],["entity_action","ENTITY ACTION"],["if_var","IF VARIABLE"],["select_obj","SELECT OBJECT"],["game_action","GAME ACTION"],["else","ELSE"],["process","PROCESS"],["repeat","REPEAT"],["if_game","IF GAME"]]

export const idToName = new Map(defaultBlockNames);
export const nameToId = new Map(defaultBlockNames.map(x => x.reverse()) as [String, Block['block']][]);