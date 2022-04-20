import React, { useContext } from 'react'
import { Context } from '../../store'

export default function Grandson() {
  const { state, dispatch } = useContext(Context)
  return (
    <div className='border-2 border-solid border-gray-300 p-2 mt-2'>
      <span>count: { state.count }</span>
      <button className='bg-sky-500 px-5 text-white rounded-md' onClick={() => dispatch({ type: 'reset' })}>reset</button>
    </div>
  )
}