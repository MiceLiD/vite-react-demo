import React, { useReducer } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom'

import Home from './views/home'
import Redux from './views/redux'
import Clocks from './views/clocks'

import './assets/style/index.less'
import './assets/style/tailwind.css'
import logo from './assets/image/logo.svg'
import { Context, reducer, initialState } from './store'
import { useDarkMod } from './hooks/useDarkMod'

const naviLinks = [
  { to: '/', name: 'home', elment: <Home /> },
  { to: '/redux', name: 'Redux', elment: <Redux /> },
  { to: '/clocks', name: 'Clocks', elment: <Clocks /> },
  { to: '*', name: '404', elment: <h1 className='text-center text-4xl mt-16'>404 Not Found</h1> }
]

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const onNavLinkStyle = ({ isActive }: { isActive: boolean }) => {
    return isActive ? 'text-sky-300' : ''
  }
  useDarkMod(dispatch)
  return (
    <Context.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <div className="flex flex-col h-screen">
          <div className="flex flex-row items-center justify-between p-5 bg-gray-600">
            <div className='flex flex-row items-center'>
              <img className='h-6' src={logo} alt="" />
              {
                naviLinks.slice(0, naviLinks.length - 1).map((nl) => {
                  return (
                    <div key={nl.to} className='pl-3 text-white hover:text-sky-300 transition-color duration-300 underline'>
                      <NavLink to={nl.to} className={onNavLinkStyle}>{nl.name}</NavLink>
                    </div>
                  )
                })
              }
            </div>
            <div>
              <button
                className='bg-white px-5 rounded-md text-black dark:bg-black dark:text-white'
                onClick={() => dispatch({ type: 'toggle-theme' })}>
                { state.theme }
              </button>
            </div>
          </div>
          <div className="flex-1 p-2 dark:bg-black dark:text-white">
            {/* style={{ background: `url(${logo}) no-repeat center`, ...theme }} */}
            <Routes>
              {
                naviLinks.map((nl) => {
                  return (
                    <Route key={nl.to} path={nl.to} element={ nl.elment } />
                  )
                })
              }
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </Context.Provider>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
