import type { Block } from "./Template.js"

export default interface Arguments {
    items: Argument[]
}
export interface Argument {
    item: Item
    slot: number
};

export interface Named {
    id: 'num' | 'txt' | 'comp'
    data: {
        name: string
    }
}
export interface Variable {
    id: 'var'
    data: {
        name: string
        scope: 'saved' | 'unsaved' | 'local' | 'line'
    }
}
export interface Parameter {
    id: 'pn_el'
    data: {
        name: string
        type: Item['id'] | 'any' | 'list' | 'dict'
        plural?: boolean
        optional?: boolean
        note?: string
        description?: string
        default: Item
        default_value: Item
    }
}

export interface Location {
    id: 'loc',
    data: {
        isBlock: boolean
        loc: {
            x: number
            y: number
            z: number
            pitch: number
            yaw: number
        }
    }
}

export interface Vector {
    id: 'vec'
    data: {
        x: number
        y: number
        z: number
    }
}

export interface Potion {
    id: 'pot',
    data: {
        pot: string
        dur: number
        amp: number
    }
}

export interface Sound {
    id: 'snd',
    data: {
        sound: string
        pitch: number
        vol:  number
    }
}

export interface GameValue {
    id: 'g_val',
    data: {
        type:   string,
        target: "Selection" | "Default" | "Victim" | "Killer" | "Damager" | "Shooter" | "Projectile" | "LastEntity"
    }
}

export interface Particle {
    id: 'part',
    data: {
        particle: string
        cluster: {
            amount:     number
            horizontal: number
            vertical:   number
        }
        data: {
            motionVariation?: number
            x?:               number
            y?:               number
            z?:               number
            colorVariation?:  number
            rgb?:             number
            sizeVariation?:   number
            size?:            number
            material?:        string
        }
    }
}

export interface MinecraftItem {
    id: 'item'
    data: {
        /**
         * S NBT
         */
        item: string
    }
}

export interface BlockTag {
    id: 'bl_tag',
    data: {
        option: string
        tag:    string
        action: string
        block:  Block['block']
        variable?: Variable
    }
}

export interface Hint {
    id: 'hint'
    data: {
        id: string
    }
}

export type Item = Named | Variable | Parameter | Location | Vector | Potion | Sound | GameValue | Particle | MinecraftItem | BlockTag | Hint;