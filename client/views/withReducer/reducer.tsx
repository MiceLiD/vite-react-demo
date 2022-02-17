export interface StateI {
  count: number
}
export interface ActionI {
  type: string
}

export const initialState: StateI = { count: 0 }

export function reducer(state: StateI, action: ActionI) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 }
    case 'decrement':
      return { count: state.count - 1 }
    case 'reset':
      return initialState
    default:
      throw new Error('Unknow Action Type' + action.type)
  }
}