// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import React, {useEffect, useRef, useState} from 'react'

function useLocalStorageState(
  key,
  defaultValue = '',
  {serialize = JSON.stringify, deserialize = JSON.parse} = {},
) {
  const [state, setState] = useState(() => {
    const localState = window.localStorage.getItem(key)
    if (localState) {
      return deserialize(localState)
    }
    return typeof defaultValue === 'function' ? defaultValue() : defaultValue
  })

  const prevKeyValue = useRef(key)
  useEffect(() => {
    const prevKey = prevKeyValue.current
    if (prevKey !== key) {
      window.localStorage.removeItem(prevKey)
    }
    prevKeyValue.current = key
    window.localStorage.setItem(key, serialize(state))
  }, [serialize, key, state])

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
        <input onChange={handleChange} id="name" value={name} />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
