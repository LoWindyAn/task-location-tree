import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import LocationTree from './components/LocationTree'

function App() {

  const [openTree, setTree] = useState(false)

  return (
    <div className='flex justify-center items-center h-[100vh] bg-white'>

      {!openTree ? <button className='border p-3 bg-gradient-to-r from-orange-300 to-orange-500 rounded-xl font-bold hover:text-white ' onClick={() => setTree(!openTree)}>Open Location Tree</button> : <LocationTree />}

    </div>
  )
}

export default App
