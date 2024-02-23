import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import TransferComponent from './components/TransferComponent'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <TransferComponent></TransferComponent>
    </>
  )
}

export default App
