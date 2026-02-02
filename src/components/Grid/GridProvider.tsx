import type { ReactNode } from 'react'
import { useState, useEffect, useRef } from 'react'
import { GridContext } from './contexts/GridContext'
import type { HexCoord, Tile, Unit } from '../../types/grid'
import { generateRectangularGrid, hexDistance, hexKey } from '../../utils/hexUtils'
import { createStartingUnits } from '../../services/unitFactory'
import { getMoveRangeTiles } from '../../services/movement'
import { getAttackRange, executeStrengthAttack, executeBreakAttack } from '../../services/combat'

interface GridProviderProps {
  children: ReactNode
  cols?: number
  rows?: number
}

export function GridProvider({ children, cols = 10, rows = 10 }: GridProviderProps) {
  const [tiles, setTiles] = useState<Map<string, Tile>>(() => {
    const tileMap = new Map<string, Tile>()
    const coords = generateRectangularGrid(cols, rows)
    coords.forEach((coord) => {
      tileMap.set(hexKey(coord), { coord, state: 'normal' })
    })
    return tileMap
  })

  const [units, setUnits] = useState<Map<string, Unit>>(() => {
    return createStartingUnits()
  })

  const [hoveredTile, setHoveredTile] = useState<HexCoord | null>(null)
  const [selectedTile, setSelectedTile] = useState<HexCoord | null>(null)
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null)
  const isInitialized = useRef(false)

  const getTile = (coord: HexCoord) => {
    return tiles.get(hexKey(coord))
  }

  const setTileState = (coord: HexCoord, state: Tile['state']) => {
    setTiles((prev) => {
      const newTiles = new Map(prev)
      const key = hexKey(coord)
      const existing = newTiles.get(key)
      if (existing) {
        newTiles.set(key, { ...existing, state })
      }
      return newTiles
    })
  }

  const resetTileStates = () => {
    setTiles((prev) => {
      const newTiles = new Map(prev)
      prev.forEach((tile, key) => {
        newTiles.set(key, { ...tile, state: 'normal' })
      })
      return newTiles
    })
  }

  const isNeighbor = (a: HexCoord, b: HexCoord) => {
    return hexDistance(a, b) === 1
  }

  const getNeighbors = (coord: HexCoord) => {
    return Array.from(tiles.values())
      .filter((tile) => isNeighbor(coord, tile.coord))
      .map((tile) => tile.coord)
  }

  const getUnitStartCoords = (unit: Unit): HexCoord | null => {
    const id = unit.id
    if (id.includes('warrior_0')) return { q: 0, r: 0 }
    if (id.includes('archer_0')) return { q: 1, r: 0 }
    if (id.includes('warrior_1')) return { q: 2, r: 0 }
    if (id.includes('enemy')) {
      if (id.includes('warrior_0')) return { q: -1, r: 9 }
      if (id.includes('archer_0')) return { q: 0, r: 9 }
      if (id.includes('warrior_1')) return { q: -2, r: 9 }
      if (id.includes('warrior_2')) return { q: -2, r: 4 }
      if (id.includes('warrior_3')) return { q: 1, r: 3 }
      if (id.includes('archer_1')) return { q: 2, r: 2 }
    }
    return null
  }

  useEffect(() => {
    if (isInitialized.current) return
    const placedUnits = new Set<string>()
    units.forEach((unit) => {
      if (unit.isDead) return
      const startCoords = getUnitStartCoords(unit)
      if (startCoords) {
        const key = hexKey(startCoords)
        if (placedUnits.has(key)) return
        placedUnits.add(key)
        setTiles((prev) => {
          const newTiles = new Map(prev)
          const tile = newTiles.get(key)
          if (tile) {
            newTiles.set(key, { ...tile, unit })
          }
          return newTiles
        })
      }
    })
    isInitialized.current = true
  })

  const addUnit = (unit: Unit, coord: HexCoord) => {
    setTiles((prev) => {
      const newTiles = new Map(prev)
      const key = hexKey(coord)
      const existing = newTiles.get(key)
      if (existing) {
        newTiles.set(key, { ...existing, unit })
      }
      return newTiles
    })
    setUnits((prev) => new Map(prev).set(unit.id, unit))
  }

  const moveUnit = (unitId: string, fromCoord: HexCoord, toCoord: HexCoord) => {
    setTiles((prev) => {
      const newTiles = new Map(prev)
      const fromKey = hexKey(fromCoord)
      const toKey = hexKey(toCoord)

      const fromTile = newTiles.get(fromKey)
      const toTile = newTiles.get(toKey)

      if (fromTile && toTile && fromTile.unit && !toTile.unit) {
        newTiles.set(fromKey, { ...fromTile, unit: undefined })
        newTiles.set(toKey, { ...toTile, unit: fromTile.unit })
      }

      return newTiles
    })

    setUnits((prev) => {
      const newUnits = new Map(prev)
      const unit = newUnits.get(unitId)
      if (unit) {
        newUnits.set(unitId, { ...unit, hasMoved: true })
      }
      return newUnits
    })
  }

  const selectUnit = (unitId: string) => {
    const unit = units.get(unitId)
    if (unit) {
      setSelectedUnit(unit)
      resetTileStates()
      findUnitTile(unit)
      showMovementRange(unit)
    }
  }

  const findUnitTile = (unit: Unit) => {
    tiles.forEach((tile) => {
      if (tile.unit?.id === unit.id) {
        setSelectedTile(tile.coord)
      }
    })
  }

  const showMovementRange = (unit: Unit) => {
    const blockedCoords = new Set<string>()
    tiles.forEach((tile) => {
      if (tile.unit && tile.unit.id !== unit.id) {
        blockedCoords.add(hexKey(tile.coord))
      }
    })

    const moveRange = getMoveRangeTiles(unit, tiles, blockedCoords)

    setTiles((prev) => {
      const newTiles = new Map(prev)
      moveRange.forEach((tileKey) => {
        const tile = newTiles.get(tileKey)
        if (tile && !tile.unit) {
          newTiles.set(tileKey, { ...tile, state: 'move-target' })
        }
      })
      return newTiles
    })
  }

  const getEnemyUnits = () => {
    const enemyUnits = new Map<string, Unit>()
    tiles.forEach((tile) => {
      if (tile.unit && tile.unit.team === 'enemy') {
        enemyUnits.set(hexKey(tile.coord), tile.unit)
      }
    })
    return enemyUnits
  }

  const showAttackRange = (unit: Unit, coord: HexCoord) => {
    resetTileStates()
    const enemyUnits = getEnemyUnits()
    const allCoords = new Map<string, HexCoord>()
    tiles.forEach((tile) => {
      allCoords.set(hexKey(tile.coord), tile.coord)
    })

    const attackRange = getAttackRange(unit, coord, allCoords, enemyUnits)

    setTiles((prev) => {
      const newTiles = new Map(prev)
      attackRange.forEach((target) => {
        const tile = newTiles.get(target.tileKey)
        if (tile) {
          newTiles.set(target.tileKey, { ...tile, state: 'attack-target' })
        }
      })
      return newTiles
    })
  }

  const removeUnit = (unitId: string) => {
    setTiles((prev) => {
      const newTiles = new Map(prev)
      prev.forEach((tile, key) => {
        if (tile.unit?.id === unitId) {
          newTiles.set(key, { ...tile, unit: undefined })
        }
      })
      return newTiles
    })

    setUnits((prev) => {
      const newUnits = new Map(prev)
      const unit = newUnits.get(unitId)
      if (unit) {
        newUnits.set(unitId, { ...unit, isDead: true })
      }
      return newUnits
    })
  }

  const executeStrengthAttackHandler = (attacker: Unit, defenderId: string) => {
    let defender: Unit | null = null
    tiles.forEach((tile) => {
      if (tile.unit?.id === defenderId) {
        defender = tile.unit
      }
    })

    if (!defender) return

    const result = executeStrengthAttack(attacker, defender)

    setTiles((prev) => {
      const newTiles = new Map(prev)
      let defenderTileKey = ''
      prev.forEach((tile, key) => {
        if (tile.unit?.id === defenderId) {
          defenderTileKey = key
        }
      })

      if (result.defenderDied) {
        newTiles.set(defenderTileKey, { ...newTiles.get(defenderTileKey)!, unit: undefined })
      } else {
        newTiles.set(defenderTileKey, { ...newTiles.get(defenderTileKey)!, unit: result.defender })
      }

      return newTiles
    })

    setUnits((prev) => {
      const newUnits = new Map(prev)
      const updatedAttacker = { ...attacker, hasActed: true }
      newUnits.set(attacker.id, updatedAttacker)
      if (result.defenderDied) {
        const existingDefender = newUnits.get(defenderId)
        if (existingDefender) {
          newUnits.set(defenderId, { ...existingDefender, isDead: true })
        }
      }
      return newUnits
    })

    resetTileStates()
  }

  const executeBreakAttackHandler = (attacker: Unit, defenderId: string) => {
    let defender: Unit | null = null
    tiles.forEach((tile) => {
      if (tile.unit?.id === defenderId) {
        defender = tile.unit
      }
    })

    if (!defender) return

    const result = executeBreakAttack(attacker, defender)

    setTiles((prev) => {
      const newTiles = new Map(prev)
      let defenderTileKey = ''
      prev.forEach((tile, key) => {
        if (tile.unit?.id === defenderId) {
          defenderTileKey = key
        }
      })

      newTiles.set(defenderTileKey, { ...newTiles.get(defenderTileKey)!, unit: result.defender })

      return newTiles
    })

    setUnits((prev) => {
      const newUnits = new Map(prev)
      const updatedAttacker = { ...attacker, hasActed: true }
      newUnits.set(attacker.id, updatedAttacker)
      const existingDefender = newUnits.get(defenderId)
      if (existingDefender) {
        newUnits.set(defenderId, result.defender)
      }
      return newUnits
    })

    resetTileStates()
  }

  const deselectUnit = () => {
    setSelectedUnit(null)
    setSelectedTile(null)
    resetTileStates()
  }

  return (
    <GridContext.Provider
      value={{
        tiles,
        units,
        hoveredTile,
        selectedTile,
        selectedUnit,
        setHoveredTile,
        setSelectedTile,
        setSelectedUnit,
        getTile,
        setTileState,
        resetTileStates,
        isNeighbor,
        getNeighbors,
        addUnit,
        moveUnit,
        removeUnit,
        selectUnit,
        showMovementRange,
        showAttackRange,
        executeStrengthAttack: executeStrengthAttackHandler,
        executeBreakAttack: executeBreakAttackHandler,
        deselectUnit
      }}
    >
      {children}
    </GridContext.Provider>
  )
}