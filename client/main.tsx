import React, { createContext, useState } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, NavLink, Route, Routes, useMatch, useLocation } from 'react-router-dom'

import Home from './views/home'
import UseReducer from './views/withReducer'
import Clock from './views/clock'

import './assets/style/index.less'
import './assets/style/tailwind.css'
import logo from './assets/image/logo.svg'
import { themes, ThemeContext } from './contexts'

function App() {
  const [theme, setTheme] = useState(themes.light)
  const themeProviderValue = {
    theme,
    toggleTheme: () => {
      setTheme((preTheme) => {
        return preTheme === themes.light ? themes.dark : themes.light
      })
    }
  }
  const onNavLinkStyle = ({ isActive }: { isActive: boolean }) => {
    return isActive ? 'text-sky-300' : ''
  }
  const naviLinks = [
    { to: '/', name: 'home', elment: <Home /> },
    { to: '/useReducer', name: 'useReducer', elment: <UseReducer /> },
    { to: '/clock', name: 'Clock', elment: <Clock /> },
    { to: '*', name: '404', elment: <h1 className='text-center text-4xl mt-16'>404 Not Found</h1> }
  ]

  return (
    <ThemeContext.Provider value={ themeProviderValue }>
      <BrowserRouter>
        <div className="flex flex-col h-screen">
          <div className="flex flex-row items-center justify-between p-5 bg-gray-600">
            <div className='flex flex-row items-center '>
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
              <div></div>
            </div>
          </div>
          <div className="flex-1 p-2">
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
    </ThemeContext.Provider>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
