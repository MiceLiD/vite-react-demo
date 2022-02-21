import React, { useContext } from 'react'
import Grandson from './Grandson'
import { Context } from '../../store'

export default function Child() {
  const { dispatch } = useContext(Context)
  return (
    <div className='border-2 border-solid border-gray-300 p-2 mt-2'>
      <button
        className='bg-sky-500 px-5 rounded-md text-white'
        onClick={() => dispatch({ type: 'toggle-theme' })}>
        ToggleTheme
      </button>
      <br />
      <Grandson />
    </div>
  )
}