import { useContext } from 'react'
import { GridContext } from '../components/Grid/contexts/GridContext'

export function useGrid() {
  const context = useContext(GridContext)
  if (!context) {
    throw new Error('useGrid must be used within a GridProvider')
  }
  return context
}