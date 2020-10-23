// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import React, {useEffect, useState} from 'react'
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {ErrorBoundary} from 'react-error-boundary'
import {
  fetchPokemon,
  PokemonDataView,
  PokemonForm,
  PokemonInfoFallback,
} from '../pokemon'

function PokemonInfo({pokemonName}) {
  // 🐨 Have state for the pokemon (null)
  const [{pokemon, error, status}, setState] = useState({
    status: pokemonName ? 'pending' : 'idle',
  })
  useEffect(() => {
    if (!pokemonName) {
      return
    }
    setState({
      status: 'pending',
    })
    fetchPokemon(pokemonName).then(
      pokemon => {
        setState({
          pokemon,
          status: 'resolved',
        })
      },
      error => setState({error, status: 'rejected'}),
    )
  }, [pokemonName])

  if (status === 'idle') return 'Submit a pokemon'
  if (status === 'pending') return <PokemonInfoFallback name={pokemonName} />
  if (status === 'rejected') throw error
  if (status === 'resolved') {
    return <PokemonDataView pokemon={pokemon} />
  }

  throw new Error(`Invalid status: ${status}`)
}

function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

/*
class ErrorBoundaryFromScratch extends React.Component {
  constructor(props) {
    super(props)
    this.state = {error: null}
  }

  static getDerivedStateFromError(error) {
    return {error}
  }

  render() {
    const {error} = this.state
    const {FallbackComponent, children} = this.props
    if (error) {
      return <FallbackComponent error={error} />
    }

    return children
  }
}
*/

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
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={() => setPokemonName('')}
          resetKeys={[pokemonName]}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
