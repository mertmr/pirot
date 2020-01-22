import axios from 'axios';

import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

export const ACTION_TYPES = {
  FETCH_LOGS: 'Report/FETCH_LOGS',
  FETCH_LOGS_CHANGE_LEVEL: 'Report/FETCH_LOGS_CHANGE_LEVEL',
  FETCH_HEALTH: 'Report/FETCH_HEALTH',
  FETCH_METRICS: 'Report/FETCH_METRICS',
  FETCH_THREAD_DUMP: 'Report/FETCH_THREAD_DUMP',
  FETCH_CONFIGURATIONS: 'Report/FETCH_CONFIGURATIONS',
  FETCH_ENV: 'Report/FETCH_ENV',
  FETCH_CIROS: 'Report/FETCH_CIROS'
};

const initialState = {
  loading: false,
  errorMessage: null,
  logs: {
    loggers: [] as any[]
  },
  health: {} as any,
  metrics: {} as any,
  threadDump: [],
  configuration: {
    configProps: {} as any,
    env: {} as any
  },
  ciros: [],
  totalItems: 0
};

export type CiroState = Readonly<typeof initialState>;

// Reducer

export default (state: CiroState = initialState, action): CiroState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_METRICS):
    case REQUEST(ACTION_TYPES.FETCH_THREAD_DUMP):
    case REQUEST(ACTION_TYPES.FETCH_LOGS):
    case REQUEST(ACTION_TYPES.FETCH_CONFIGURATIONS):
    case REQUEST(ACTION_TYPES.FETCH_ENV):
    case REQUEST(ACTION_TYPES.FETCH_CIROS):
    case REQUEST(ACTION_TYPES.FETCH_HEALTH):
      return {
        ...state,
        errorMessage: null,
        loading: true
      };
    case FAILURE(ACTION_TYPES.FETCH_METRICS):
    case FAILURE(ACTION_TYPES.FETCH_THREAD_DUMP):
    case FAILURE(ACTION_TYPES.FETCH_LOGS):
    case FAILURE(ACTION_TYPES.FETCH_CONFIGURATIONS):
    case FAILURE(ACTION_TYPES.FETCH_ENV):
    case FAILURE(ACTION_TYPES.FETCH_CIROS):
    case FAILURE(ACTION_TYPES.FETCH_HEALTH):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_METRICS):
      return {
        ...state,
        loading: false,
        metrics: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_THREAD_DUMP):
      return {
        ...state,
        loading: false,
        threadDump: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_LOGS):
      return {
        ...state,
        loading: false,
        logs: {
          loggers: action.payload.data.loggers
        }
      };
    case SUCCESS(ACTION_TYPES.FETCH_CONFIGURATIONS):
      return {
        ...state,
        loading: false,
        configuration: {
          ...state.configuration,
          configProps: action.payload.data
        }
      };
    case SUCCESS(ACTION_TYPES.FETCH_ENV):
      return {
        ...state,
        loading: false,
        configuration: {
          ...state.configuration,
          env: action.payload.data
        }
      };
    case SUCCESS(ACTION_TYPES.FETCH_CIROS):
      return {
        ...state,
        loading: false,
        ciros: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_HEALTH):
      return {
        ...state,
        loading: false,
        health: action.payload.data
      };
    default:
      return state;
  }
};

// Actions

export const systemHealth = () => ({
  type: ACTION_TYPES.FETCH_HEALTH,
  payload: axios.get('management/health')
});

export const systemMetrics = () => ({
  type: ACTION_TYPES.FETCH_METRICS,
  payload: axios.get('management/jhimetrics')
});

export const systemThreadDump = () => ({
  type: ACTION_TYPES.FETCH_THREAD_DUMP,
  payload: axios.get('management/threaddump')
});

export const getLoggers = () => ({
  type: ACTION_TYPES.FETCH_LOGS,
  payload: axios.get('management/loggers')
});

export const changeLogLevel = (name, configuredLevel) => {
  const body = { configuredLevel };
  return async dispatch => {
    await dispatch({
      type: ACTION_TYPES.FETCH_LOGS_CHANGE_LEVEL,
      payload: axios.post('management/loggers/' + name, body)
    });
    dispatch(getLoggers());
  };
};

export const getConfigurations = () => ({
  type: ACTION_TYPES.FETCH_CONFIGURATIONS,
  payload: axios.get('management/configprops')
});

export const getEnv = () => ({
  type: ACTION_TYPES.FETCH_ENV,
  payload: axios.get('management/env')
});

export const getCiros = (page, size, sort, fromDate, toDate) => {
  let requestUrl = `api/reports/ciro${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  if (fromDate) {
    requestUrl += `&fromDate=${fromDate}`;
  }
  if (toDate) {
    requestUrl += `&toDate=${toDate}`;
  }
  return {
    type: ACTION_TYPES.FETCH_CIROS,
    payload: axios.get(requestUrl)
  };
};
