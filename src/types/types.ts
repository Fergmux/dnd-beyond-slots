export interface Item {
  name: string
  slot: string
  id: number
  img: string
  size: number
  track: boolean
  index: number
}

export interface Slot {
  id: string
  name: string
  size: number
  index: number
}

export interface Event {
  type: string
  value?: any
}

export type Items = Record<string, Item>

export type Slots = Record<string, Slot>

export interface SyncEvent extends Event {
  value: {
    items: Items
    slots: Slots
  }
}

export interface UpdateItemEvent extends Event {
  value: Item[]
}

export interface UpdateSlotsEvent extends Event {
  value: Slots
}

export interface UpdateKeyEvent extends Event {
  value: string
}
