enum EViewMode {
  LIST = 'LIST',
  DETAIL = 'DETAIL',
  SEARCH = 'SEARCH',
  CODE_SEARCH = 'CODE_SEARCH',
  STEP1 = 'STEP1',
  STEP2 = 'STEP2',
  STEP3 = 'STEP3'
}

enum EWorkOrderDeatilViewMode {
  BASE = '',
  BM_OPERATION_HOUR = 'BM_OPERATION_HOUR',
  BM_HISTORY = 'BM_HISTORY',
  BM_DIAGNOSIS = 'BM_DIAGNOSIS',
  BM_SAFETY_PLAN = 'BM_SAFETY_PLAN'
}
export default {
  EViewMode,
  EWorkOrderDeatilViewMode
}
