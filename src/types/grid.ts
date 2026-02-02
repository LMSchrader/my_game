export interface HexCoord {
  q: number
  r: number
}

export interface Tile {
  coord: HexCoord
  unit?: Unit
  state: 'normal' | 'move-target' | 'attack-target' | 'occupied' | 'hovered'
}

export interface Unit {
  id: string
  name: string
  className: 'Warrior' | 'Archer' | 'Shaman'
  team: 'player' | 'enemy'
  strength: number
  armor: number
  willpower: number
  maxWillpower: number
  breakPower: number
  baseMove: number
  hasMoved: boolean
  hasActed: boolean
  isDead: boolean
}