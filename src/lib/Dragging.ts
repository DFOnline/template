export const DRAGGING_TYPES = {
    ITEM: 'dfo_template_item',
    BLOCK: 'dfo_template_block',
} as const
export type DraggingType = typeof DRAGGING_TYPES[keyof typeof DRAGGING_TYPES]

const TYPE_TYPE = 'x_dfo_template_type'
const INDEX_TYPE = 'x_dfo_template_index'

function setDragging(drag: DataTransfer, type: DraggingType, index: number) {
    drag.setData(TYPE_TYPE, type)
    drag.setData(INDEX_TYPE, '' + index)
}