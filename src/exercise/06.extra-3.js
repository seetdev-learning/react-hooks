// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {fetchPokemon, PokemonForm, PokemonInfoFallback, PokemonDataView} from '../pokemon'

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({
    status: 'idle',
    pokemon: null,
    error: null
  })
  React.useEffect(() => {
    if(!pokemonName) return
    setState(state => ({ ...state, status: 'pending'}))
    fetchPokemon(pokemonName).then(
      pokemon => {
        setState(state => ({ ...state, status: 'resolved', pokemon}))
      },
      error => {
        setState(state => ({ ...state, status: 'rejected', error}))
      }
    )
  }, [pokemonName])

  const {status, pokemon, error} = state
  if(status === 'idle') {
    return 'Submit a pokemon'
  }

  if(status === 'rejected') {
    return <div role="alert">
      There was an error: <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
    </div>
  }

  if(status === 'pending')  {
    return <PokemonInfoFallback name={pokemonName} />
  }

  return <PokemonDataView pokemon={pokemon} />
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonInfo pokemonName={pokemonName} />
      </div>
    </div>
  )
}

export default App
