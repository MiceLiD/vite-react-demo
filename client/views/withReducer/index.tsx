import React, { useCallback, useContext, useEffect, useReducer, useState } from 'react'
import { DispatchContext, ThemeContext } from '../../contexts'
import { ActionI, reducer, initialState } from './reducer'
import Son from './Son'

export default function Parent() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [x, setX] = useState(0)
  const dispatchProviderValue = (action: ActionI) => {
    dispatch(action)
  }
  useEffect(() => {
    console.log('effected once! and state = ', state, 'x = ', x)
  }, [])
  useEffect(() => {
    console.log('effected by state and state = ', state, 'x = ', x)
  }, [state])
  useEffect(() => {
    xCb()
    console.log('effected by x and state = ', state, 'x = ', x)
  }, [x])
  useEffect(() => {
    console.log('effected every time! and state = ', state, 'x = ', x)
    xCb()
  })

  const xCb = useCallback(() => {
    console.log('satate = ', state)
  }, [x])
  const { theme } = useContext(ThemeContext)
  return (
    <DispatchContext.Provider value={dispatchProviderValue}>
      <div className='border-2 border-solid border-gray-300 p-2' style={{ ...theme }}>
        Count: { state.count } ——— &nbsp;
        <button className='px-5 bg-sky-500 text-white rounded-md' onClick={ () => dispatch({ type: 'decrement' }) }>-</button> &nbsp;
        <button className='px-5 bg-sky-500 text-white rounded-md' onClick={ () => dispatch({ type: 'increment' }) }>+</button> &nbsp;
        <button className='px-5 bg-sky-500 text-white rounded-md' onClick={ () => { dispatch({ type: 'reset' }); setX(state.count) } }>reset</button> <br />
        <Son />
      </div>
    </DispatchContext.Provider>
  )
}
