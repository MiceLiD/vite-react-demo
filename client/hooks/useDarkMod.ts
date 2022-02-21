import { TDispatch } from "client/store"
import { useEffect } from "react"

export function useDarkMod(dispatch: TDispatch) {
  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      dispatch({ type: 'toggle-theme', payload: 'dark' })
    }
    if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      dispatch({ type: 'toggle-theme', payload: 'light' })
    }
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      e.matches && dispatch({ type: 'toggle-theme', payload: 'dark' })
    })
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
      e.matches && dispatch({ type: 'toggle-theme', payload: 'light' })
    })
  }, [])
}