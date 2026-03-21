// import { useState } from 'react'
import ThreeScene from './components/ThreeScene'
import { useCharacterStore } from './store/useCharacterStore.js'

function App() {
  // const [count, setCount] = useState(0)
  const goalReached = useCharacterStore((s) => s.goalReached);

  return (
    <>
        <h1>Hello, React3D</h1>
        <p>Goal reached: {goalReached ? 'Yes' : 'No'}</p>
        <ThreeScene />
    </>
  )
}

export default App
