import { createContext } from "react"

export interface ThemeI {
  [k: string]: string
}

export interface StateI {
  count: number
  theme: string
}
export interface ActionI {
  type: 'increment' | 'decrement' | 'reset' | 'toggle-theme'
  payload?: any
}
export type TDispatch = (action: ActionI) => void

export const initialState: StateI = { count: 0, theme: 'light' }

export function reducer(state: StateI, action: ActionI) {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + 1 }
    case 'decrement':
      return { ...state, count: state.count - 1 }
    case 'reset':
      return initialState
    case 'toggle-theme':
      const { payload: theme } = action
      const isLight = state.theme === 'light'
      const htmlTag = document.getElementsByTagName('html')[0]
      htmlTag.className = theme || (isLight ? 'dark' : 'light')
      return { ...state, theme: theme || (isLight ? 'dark' : 'light') }
    default:
      throw new Error('Unknow Action Type' + action.type)
  }
}

export const Context = createContext({
  state: initialState,
  dispatch: (action: ActionI) => {}
})
