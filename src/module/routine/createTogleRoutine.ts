import { createActionCreator, Action, getType } from 'deox'

export const createTogleRoutine = (typePrefix: string = 'PERFIX'): TogleRoutine => {
  const on = createActionCreator(`${typePrefix}_ON`, (resolve) => () => resolve(true))
  const off = createActionCreator(`${typePrefix}_OFF`, (resolve) => () => resolve(false))

  return {
    on,
    off,
    ON: getType(on),
    OFF: getType(off)
  }
}

export interface TogleRoutine {
  on: (() => Action<string, undefined, undefined>) & {
    type: string
    toString(): string
  }
  ON: string
  off: (() => Action<string, undefined, undefined>) & {
    type: string
    toString(): string
  }
  OFF: string
}
