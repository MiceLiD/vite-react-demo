import { ThemeContext } from '../../contexts'
import React, { useContext } from 'react'
import Grandson from './Grandson'

export default function Child() {
  const { toggleTheme, theme } = useContext(ThemeContext)
  return (
    <div className='border-2 border-solid border-gray-300 p-2 mt-2'>
      <button className='bg-sky-500 px-5 rounded-md text-white' onClick={toggleTheme}>ToggleTheme</button> <br />
      <Grandson />
    </div>
  )
}