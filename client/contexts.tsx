import { createContext } from "react"
import { ActionI } from "./views/withReducer/reducer"

export const themes = {
  light: {
    backgroundColor: '#fff',
    color: '#000'
  },
  dark: {
    backgroundColor: '#000',
    color: '#fff'
  }
}
export const ThemeContext = createContext({
  theme: themes.light,
  toggleTheme: () => {}
})

export const DispatchContext = createContext((type: ActionI) => {})
