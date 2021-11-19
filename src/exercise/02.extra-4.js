// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import React, {useEffect, useRef, useState} from 'react'

function useLocalStorageState(key, 
  defaultValue = '', 
  { serialized = JSON.stringify, deserialized = JSON.parse} = {}) {
  
    const [state, setState] = useState(() => {
    const localStorageValue = window.localStorage.getItem(key)
    if(localStorageValue) {
      return deserialized(localStorageValue)
    }
    return typeof defaultValue === 'function' ? defaultValue() : defaultValue
  })

  const prevKeyRef = useRef(key)
  useEffect(() => {
    const prevKey = prevKeyRef.current
    if(prevKey !== key) window.localStorage.removeItem(prevKey)
    
    prevKeyRef.current = key
    window.localStorage.setItem(key, serialized(state))
  }, [key, state, serialized])
  
  return [state, setState] 
}
function Greeting({initialName = ''}) {
  const [name, setName] = useLocalStorageState('name', initialName)

  function handleChange(event) {
    setName(event.target.value)
  }

  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" autoComplete="off" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
