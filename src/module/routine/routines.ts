import { createActionCreator, getType, Action } from 'deox'

/**
 * 기본 루틴
 */
interface Routine<P> {
  action: ((params?: P) => Action<string, P, undefined>) & {
    type: string
    toString(): string
  }
  PREFIX: string
  ACTION_TYPE: string
}
type RoutineCreator = <P>(prefix: string) => Routine<P>
export const createRoutine: RoutineCreator = <Payload>(typePrefix: string): Routine<Payload> => {
  const action = createActionCreator(`${typePrefix}_ACTION`, (resolve) => (payload?: Payload) => resolve(payload, undefined))
  // EPath
  return {
    action,
    PREFIX: typePrefix,
    ACTION_TYPE: getType(action)
  }
}

/**
 * 비동기 루틴
 * Request trigger의 payload
 * Response success의 payload
 */
interface AsyncRoutine<Request, Response> {
  trigger: ((request?: Request) => Action<string, Request, undefined>) & {
    type: string
    toString(): string
  }
  success: ((response?: Response, meta?: any) => Action<string, Response, any>) & {
    type: string
    toString(): string
  }
  failure: ((error?: Error) => Action<string, Error>) & {
    type: string
    toString(): string
  }
  PREFIX: string
  TRIGGER_TYPE: string
  SUCCESS_TYPE: string
  FAILURE_TYPE: string
}
type AsyncRoutineCreator = <Request, Response = void>(prefix: string) => AsyncRoutine<Request, Response>

export const createAsyncRoutine: AsyncRoutineCreator = <Request, Response = void>(typePrefix: string): AsyncRoutine<Request, Response> => {
  const trigger = createActionCreator(`${typePrefix}_TRIGGER`, (resolve) => (request?: Request) => resolve(request, undefined))
  const success = createActionCreator(`${typePrefix}_SUCCESS`, (resolve) => (response?: Response, meta?: any) => resolve(response, meta))
  const failure = createActionCreator(`${typePrefix}_FAILURE`, (resolve) => (error?: Error) => resolve(error))
  return {
    trigger,
    success,
    failure,
    PREFIX: typePrefix,
    TRIGGER_TYPE: getType(trigger),
    SUCCESS_TYPE: getType(success),
    FAILURE_TYPE: getType(failure)
  }
}
