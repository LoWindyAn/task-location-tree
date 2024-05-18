import { useState } from 'react'
import LocationTree from './components/LocationTree'

function App() {

  const [openTree, setTree] = useState(false)

  return (
    <div className='flex justify-center items-center h-[100vh] bg-white'>

      {!openTree ? <button className='border-2 border-black p-3 bg-white rounded-xl font-bold hover:text-white hover:bg-black' onClick={() => setTree(!openTree)}>Open Location Tree</button> : <LocationTree />}

    </div>
  )
}

export default App
