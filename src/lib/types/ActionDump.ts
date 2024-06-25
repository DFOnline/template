import { GeneratedIdentifierFlags } from "typescript"

export default interface ActionDump {
    actions: Action[]
}

export interface Item {
    material:             string
    name:                 string
    deprecatedNote:       string[]
    description:          string[]
    example:              string[]
    worksWith:            string[]
    additionalInfo:       string[]
    requiredRank:         "" | "Noble" | "Emperor" | "Mythic" | "Overlord" | "Dev"
    requireTokens:        boolean
    requireRankAndTokens: boolean
    advanced:             boolean
    loadedItem:           string
}
export type Icon = Item & {
    tags?:      number
    arguments?: Argument[]
}
export interface Argument {
    type:        string
    plural:      boolean
    optional:    boolean
    description: string[]
    notes:       string[]
}

export interface Action  {
    name:             string
    codeblockName:    string
    tags:             Tag[]
    aliases:          string[]
    icon:             Item
    subActionBlocks?: ["if_player","if_game","if_var"] | ["if_entity","if_game","if_var"] | ["if_player","if_entity","if_game","if_var"]
}

export interface Tag {
    name:          string
    options:       Option[]
    defaultOption: string
}

export interface Option {
    name:    string
    icon:    Item
    aliases: string[]
}