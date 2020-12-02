import EViewMode from './ViewModeEnum'

export { EViewMode }

export enum EPath {
  ACCESS_TOKEN = 'oslc/apitoken/create',
  SESSION = 'api/os/zmxapimouser',
  LOGIN = '/login'
}

export enum EHeaderKey {
  PATCHTYPE = 'patchtype',
  X_METHOD_OVERRIDE = 'x-method-override'
}
export enum EPatchType {
  MERGE = 'MERGE'
}
export enum EXMethodOverride {
  PATCH = 'PATCH',
  BULK = 'BULK'
}
export enum EEventType {
  RESET = 'RESET',
  OK = 'OK',
  CANCEL = 'CANCEL'
}
export enum EDateFormat {
  YYYYMMDDTHHMINSEC = 'YYYY-MM-DDTHH:mm:ss',
  YYYYMMDDHHMIN = 'YYYY-MM-DD HH:mm',
  YYYYMMDDHHMIN_EU = 'YYYY.MM.DD HH:mm',
  YYYYMMDD = 'YYYY-MM-DD',
  YYYYMMDD_EU = 'YYYY.MM.DD',
  HHMIN = 'HH:mm'
}
