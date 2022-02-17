import React, { useContext } from 'react'
import { DispatchContext } from '../../contexts'

export default function Grandson() {
  const dispatch = useContext(DispatchContext)
  return (
    <div className='border-2 border-solid border-gray-300 p-2 mt-2'>
      <button className='bg-sky-500 px-5 text-white rounded-md' onClick={() => dispatch({ type: 'reset' })}>reset</button>
    </div>
  )
}