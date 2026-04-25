// import { useState } from 'react'
import ThreeScene from './components/ThreeScene'
import { useCharacterStore } from './store/useCharacterStore.js'
import GameUi from './components/GameUi.jsx'

function App() {
  // const [count, setCount] = useState(0)
  const goalReached = useCharacterStore((s) => s.goalReached);

  return (
    <>
        {/* <h1>This user does not believe in humans 👽</h1>
        <p>Goal reached: {goalReached ? 'Yes' : 'No'}</p> */}
        <ThreeScene />
        <GameUi />
    </>
  )
}

export default App
