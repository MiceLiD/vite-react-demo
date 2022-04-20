import React, { useReducer, lazy, Suspense, Component, createElement } from 'react'
import ReactDOM, { render } from 'react-dom'
import { HashRouter as BrowserRouter, NavLink, Route, Routes } from 'react-router-dom'

import './assets/style/index.less'
import './assets/style/tailwind.css'
import logo from './assets/image/logo.svg'
import { Context, reducer, initialState } from './store'
import { useDarkMod } from './hooks/useDarkMod'

const Home = lazy(() => import('./views/home'))
const Redux = lazy(() => import('./views/redux'))
const ThreeJs = lazy(() => import('./views/threejs'))
const Clocks = lazy(() => import('./views/clocks'))
const MapBox = lazy(() => import('./views/mapBox'))
const C404 = lazy(() => import('./views/404'))

const naviLinks = [
  { to: '/', name: 'home', component: Home },
  { to: '/redux', name: 'Redux', component: Redux },
  { to: '/threejs', name: 'ThreeJs', component: ThreeJs },
  { to: '/clocks', name: 'Clocks', component: Clocks },
  { to: '/mapbox', name: 'MapBox', component: MapBox },
  { to: '*', name: '404', component: C404 }
]

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const onNavLinkStyle = ({ isActive }: { isActive: boolean }) => {
    return isActive ? 'text-sky-300 underline' : ''
  }
  useDarkMod(dispatch)
  return (
    <Context.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <div className="flex flex-col h-screen">
          <div className="flex flex-row items-center justify-between shadow-md p-2 text-black dark:bg-gray-600 dark:text-white">
            <div className='flex flex-row items-center'>
              <img className='h-6' src={logo} alt="" />
              {
                naviLinks.slice(0, naviLinks.length - 1).map((nl) => {
                  return (
                    <div key={nl.to} className='pl-3 hover:text-sky-300 transition-color duration-300'>
                      <NavLink to={nl.to} className={onNavLinkStyle}>{nl.name}</NavLink>
                    </div>
                  )
                })
              }
            </div>
            <button
              className='text-black px-5 rounded-md dark:text-white'
              onClick={() => dispatch({ type: 'toggle-theme' })}>
              { state.theme === 'light' ?
                (<svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" className="stroke-slate-400 dark:stroke-slate-500"></path><path d="M12 4v1M17.66 6.344l-.828.828M20.005 12.004h-1M17.66 17.664l-.828-.828M12 20.01V19M6.34 17.664l.835-.836M3.995 12.004h1.01M6 6l.835.836" className="stroke-slate-400 dark:stroke-slate-500"></path></svg>)
              : (<svg viewBox="0 0 24 24" fill="none" className="w-6 h-6"><path fillRule="evenodd" clipRule="evenodd" d="M17.715 15.15A6.5 6.5 0 0 1 9 6.035C6.106 6.922 4 9.645 4 12.867c0 3.94 3.153 7.136 7.042 7.136 3.101 0 5.734-2.032 6.673-4.853Z" className="fill-sky-400/20"></path><path d="m17.715 15.15.95.316a1 1 0 0 0-1.445-1.185l.495.869ZM9 6.035l.846.534a1 1 0 0 0-1.14-1.49L9 6.035Zm8.221 8.246a5.47 5.47 0 0 1-2.72.718v2a7.47 7.47 0 0 0 3.71-.98l-.99-1.738Zm-2.72.718A5.5 5.5 0 0 1 9 9.5H7a7.5 7.5 0 0 0 7.5 7.5v-2ZM9 9.5c0-1.079.31-2.082.845-2.93L8.153 5.5A7.47 7.47 0 0 0 7 9.5h2Zm-4 3.368C5 10.089 6.815 7.75 9.292 6.99L8.706 5.08C5.397 6.094 3 9.201 3 12.867h2Zm6.042 6.136C7.718 19.003 5 16.268 5 12.867H3c0 4.48 3.588 8.136 8.042 8.136v-2Zm5.725-4.17c-.81 2.433-3.074 4.17-5.725 4.17v2c3.552 0 6.553-2.327 7.622-5.537l-1.897-.632Z" className="fill-sky-500"></path><path fillRule="evenodd" clipRule="evenodd" d="M17 3a1 1 0 0 1 1 1 2 2 0 0 0 2 2 1 1 0 1 1 0 2 2 2 0 0 0-2 2 1 1 0 1 1-2 0 2 2 0 0 0-2-2 1 1 0 1 1 0-2 2 2 0 0 0 2-2 1 1 0 0 1 1-1Z" className="fill-sky-500"></path></svg>)
              }
            </button>
          </div>
          <div className="flex-1 p-2 dark:bg-black dark:text-white">
            {/* style={{ background: `url(${logo}) no-repeat center`, ...theme }} */}
            <Routes>
              {
                naviLinks.map((nl) => {
                  return (
                    <Route key={nl.to} path={nl.to} element={
                      <Suspense fallback={<>...</>}>
                        <nl.component />
                      </Suspense>
                    }/>
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

