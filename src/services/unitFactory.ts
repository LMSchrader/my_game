import type { Unit } from '../types/grid'

export function createUnit(
  id: string,
  name: string,
  className: 'Warrior' | 'Archer' | 'Shaman',
  team: 'player' | 'enemy',
  strength: number,
  armor: number,
  willpower: number,
  breakPower: number,
  baseMove: number
): Unit {
  return {
    id,
    name,
    className,
    team,
    strength,
    armor,
    willpower,
    maxWillpower: willpower,
    breakPower,
    baseMove,
    hasMoved: false,
    hasActed: false,
    isDead: false
  }
}

export function createWarriors(
  count: number,
  team: 'player' | 'enemy'
): Unit[] {
  const units: Unit[] = []
  
  for (let i = 0; i < count; i++) {
    const unit = createUnit(
      `${team}_warrior_${i}`,
      `${team === 'player' ? 'Viking' : 'Orc'} ${i + 1}`,
      'Warrior',
      team,
      10,
      3,
      2,
      4,
      3
    )
    units.push(unit)
  }
  
  return units
}

export function createArchers(
  count: number,
  team: 'player' | 'enemy'
): Unit[] {
  const units: Unit[] = []
  
  for (let i = 0; i < count; i++) {
    const unit = createUnit(
      `${team}_archer_${i}`,
      `${team === 'player' ? 'Archer' : 'Hunter'} ${i + 1}`,
      'Archer',
      team,
      7,
      1,
      3,
      3,
      2
    )
    units.push(unit)
  }
  
  return units
}

export function createStartingUnits(): Map<string, Unit> {
  const unitMap = new Map<string, Unit>()
  
  const playerWarriors = createWarriors(2, 'player')
  const playerArchers = createArchers(1, 'player')
  
  playerWarriors.forEach((u) => unitMap.set(u.id, u))
  playerArchers.forEach((u) => unitMap.set(u.id, u))
  
  const enemyWarriors = createWarriors(2, 'enemy')
  const enemyArchers = createArchers(1, 'enemy')
  
  enemyWarriors.forEach((u) => unitMap.set(u.id, u))
  enemyArchers.forEach((u) => unitMap.set(u.id, u))
  
  return unitMap
}