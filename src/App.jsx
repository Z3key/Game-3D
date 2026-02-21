import { useState } from 'react'
import ThreeScene from './components/ThreeScene'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        <h1>Hello, React3D</h1>
        <ThreeScene />
    </>
  )
}

export default App
