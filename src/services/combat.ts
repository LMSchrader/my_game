import type { HexCoord, Unit } from '../types/grid'
import { hexKey, hexNeighbors } from '../utils/hexUtils'

export interface AttackRange {
  tileKey: string
  coord: HexCoord
}

export interface DamagePreview {
  strengthAttack: number
  breakAttack: number
  minDamage: number
  maxDamage: number
}

export function getAttackRange(unit: Unit, attackerCoord: HexCoord, allTiles: Map<string, HexCoord>, enemyUnits: Map<string, Unit>): AttackRange[] {
  const range: AttackRange[] = []

  const attackRange = unit.team === 'player' ? 1 : 2

  if (unit.className === 'Archer') {
    return getRangeAttackRange(attackerCoord, attackRange * 2, allTiles, enemyUnits)
  }

  for (const neighborCoord of hexNeighbors(attackerCoord)) {
    const neighborKey = hexKey(neighborCoord)

    if (!allTiles.has(neighborKey)) {
      continue
    }

    const targetUnit = enemyUnits.get(neighborKey)
    if (targetUnit && !targetUnit.isDead) {
      range.push({ tileKey: neighborKey, coord: neighborCoord })
    }
  }

  return range
}

function getRangeAttackRange(attackerCoord: HexCoord, range: number, allTiles: Map<string, HexCoord>, enemyUnits: Map<string, Unit>): AttackRange[] {
  const targets: AttackRange[] = []

  for (const [key, coord] of allTiles) {
    const distance = Math.abs(coord.q - attackerCoord.q) + Math.abs(coord.q + coord.r - attackerCoord.q - attackerCoord.r) + Math.abs(coord.r - attackerCoord.r)
    const hexDistance = distance / 2

    if (hexDistance > 0 && hexDistance <= range) {
      const targetUnit = enemyUnits.get(key)
      if (targetUnit && !targetUnit.isDead) {
        targets.push({ tileKey: key, coord })
      }
    }
  }

  return targets
}

export function calculateDamage(attacker: Unit, defender: Unit, attackType: 'strength' | 'break'): number {
  if (attackType === 'strength') {
    const baseDamage = attacker.strength
    const armor = defender.armor
    return Math.max(1, baseDamage - armor)
  }

  if (attackType === 'break') {
    const breakPower = attacker.breakPower
    const armor = defender.armor
    return Math.max(0, breakPower - armor)
  }

  return 0
}

export function calculateDamagePreview(attacker: Unit, defender: Unit): DamagePreview {
  const strengthDamage = calculateDamage(attacker, defender, 'strength')
  const breakDamage = calculateDamage(attacker, defender, 'break')

  return {
    strengthAttack: strengthDamage,
    breakAttack: breakDamage,
    minDamage: Math.min(strengthDamage, breakDamage),
    maxDamage: Math.max(strengthDamage, breakDamage)
  }
}

export function executeStrengthAttack(attacker: Unit, defender: Unit): { attacker: Unit; defender: Unit; damage: number; defenderDied: boolean } {
  const damage = calculateDamage(attacker, defender, 'strength')
  const newHealth = defender.strength - damage

  const updatedDefender = {
    ...defender,
    strength: newHealth,
    isDead: newHealth <= 0
  }

  const updatedAttacker = {
    ...attacker,
    hasActed: true
  }

  return {
    attacker: updatedAttacker,
    defender: updatedDefender,
    damage,
    defenderDied: updatedDefender.isDead
  }
}

export function executeBreakAttack(attacker: Unit, defender: Unit): { attacker: Unit; defender: Unit; damage: number; armorBroken: boolean } {
  const damage = calculateDamage(attacker, defender, 'break')
  const newArmor = Math.max(0, defender.armor - damage)

  const updatedDefender = {
    ...defender,
    armor: newArmor
  }

  const updatedAttacker = {
    ...attacker,
    hasActed: true
  }

  return {
    attacker: updatedAttacker,
    defender: updatedDefender,
    damage,
    armorBroken: damage > 0
  }
}