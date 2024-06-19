import type Args from "./Args.js"

export default interface Template {
    blocks: BracketsAndBlocks[]
}

export type BracketsAndBlocks = Block | Bracket
export type Block = ElseBlock | SelectionBlock | SubActionBlock | DataBlock

export interface Bracket {
    id: 'bracket'
    direct: 'open' | 'close'
    type: 'norm' | 'repeat'
}

export interface ElseBlock {
    id: 'block'
    block: 'else'
}
export function isElse(block: Block): block is ElseBlock {
    return block.block == 'else';
}

const SELECTION_BLOCKS = ['event','player_action','entity_event','entity_action','set_var','game_action','control','if_entity','if_game','if_player','if_var'] as const;
export interface SelectionBlock {
    id: 'block'
    block: typeof SELECTION_BLOCKS[number]
    action: string,
    attribute: '' | 'LS-CANCEL' | 'NOT'
    args: Args
}
export function isSelectionBlock(block: Block): block is SelectionBlock {
    return SELECTION_BLOCKS.includes(block.block as any);
}

const SUB_ACTION_BLOCKS = ['repeat','select_obj'] as const
export interface SubActionBlock {
    id: 'block'
    block: typeof SUB_ACTION_BLOCKS[number]
    action: string
    subAction: string
    args: Args
}
export function isSubActionBlock(block: Block): block is SubActionBlock {
    return SUB_ACTION_BLOCKS.includes(block.block as any);
}

const DATA_BLOCKS = ['func','call_func','process','start_process'] as const;
export interface DataBlock {
    id: 'block'
    block: typeof DATA_BLOCKS[number]
    data: string
    args: Args
}

export function isDataBlock(block: Block): block is DataBlock {
    return DATA_BLOCKS.includes(block.block as any);
}

export type ArgumentBlock = DataBlock | ActionBlock;
export function isArgumentBlock(block: Block): block is DataBlock | SelectionBlock | SubActionBlock {
    return isDataBlock(block) || isActionBlock(block);
}
export type ActionBlock = SelectionBlock | SubActionBlock;
export function isActionBlock(block: Block): block is ActionBlock {
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