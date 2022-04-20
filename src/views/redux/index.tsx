import React, { useContext } from 'react'
import { Context } from '../../store'
import Son from './Son'

export default function Parent() {
  const { state, dispatch } = useContext(Context)
  return (
    <div className={ 'border-2 border-solid border-gray-300 p-2' }>
      Count: { state.count } ——— <br />
      <button className='px-5 bg-sky-500 text-white rounded-md' onClick={ () => dispatch({ type: 'decrement' }) }>-</button> &nbsp;
      <button className='px-5 bg-sky-500 text-white rounded-md' onClick={ () => dispatch({ type: 'increment' }) }>+</button> &nbsp;
      <button className='px-5 bg-sky-500 text-white rounded-md' onClick={ () => dispatch({ type: 'reset' }) }>reset</button> <br />
      <Son />
    </div>
  )
}
