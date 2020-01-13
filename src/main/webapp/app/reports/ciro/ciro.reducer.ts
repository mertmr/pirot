import axios from 'axios';

import { FAILURE, REQUEST, SUCCESS } from 'app/shared/reducers/action-type.util';

export const ACTION_TYPES = {
  FETCH_LOGS: 'ciro/FETCH_LIST'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: []
};

export type CiroState = Readonly<typeof initialState>;

// Reducer

export default (state: CiroState = initialState, action): CiroState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_LOGS):
      return {
        ...state,
        errorMessage: null,
        loading: true
      };
    case FAILURE(ACTION_TYPES.FETCH_LOGS):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_LOGS):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    default:
      return state;
  }
};

// Actions

export const getEntities = (fromDate, toDate) => {
  let requestUrl = `api/reports/ciro`;
  if (fromDate) {
    requestUrl += `&fromDate=${fromDate}`;
  }
  if (toDate) {
    requestUrl += `&toDate=${toDate}`;
  }
  return {
    type: ACTION_TYPES.FETCH_LOGS,
    payload: axios.get(requestUrl)
  };
};
