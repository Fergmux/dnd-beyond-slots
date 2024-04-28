export interface Item {
  name: string
  slot: Slot
  index: number
}

export enum Slot {
  equipped = 'equipped',
  pockets = 'pockets',
  worn = 'worn',
  backpack = 'backpack'
}
