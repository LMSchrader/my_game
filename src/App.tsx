import { GridProvider } from './components/Grid/GridProvider'
import Grid from './components/Grid/Grid'
import './App.css'

function App() {
  return (
    <div style={{ backgroundColor: '#1a1a1a', position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      <GridProvider cols={10} rows={10}>
        <h1 style={{ color: '#e0e0e0', textAlign: 'center', paddingTop: '20px', position: 'absolute', width: '100%', zIndex: 1, margin: 0 }}>
           Tactical Combat
        </h1>
        <Grid />
      </GridProvider>
    </div>
  )
}

export default App
