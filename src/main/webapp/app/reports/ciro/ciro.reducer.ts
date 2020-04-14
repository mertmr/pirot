import axios from 'axios';

import { FAILURE, REQUEST, SUCCESS } from 'app/shared/reducers/action-type.util';
import { defaultValue } from 'app/shared/model/ciro.model';

export const ACTION_TYPES = {
  FETCH_CIROS: 'Report/FETCH_CIROS',
  FETCH_CIROS_BY_NOBETCI: 'Report/FETCH_CIROS_BY_NOBETCI'
};

const initialState = {
  loading: false,
  errorMessage: null,
  fromDateProp: null,
  toDateProp: null,
  totalItems: 0,
  ciros: []
};

export type CiroState = Readonly<typeof initialState>;

// Reducer

export default (state: CiroState = initialState, action): CiroState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_CIROS_BY_NOBETCI):
    case REQUEST(ACTION_TYPES.FETCH_CIROS):
      return {
        ...state,
        errorMessage: null,
        loading: true
      };
    case FAILURE(ACTION_TYPES.FETCH_CIROS_BY_NOBETCI):
    case FAILURE(ACTION_TYPES.FETCH_CIROS):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_CIROS_BY_NOBETCI):
    case SUCCESS(ACTION_TYPES.FETCH_CIROS):
      return {
        ...state,
        loading: false,
        ciros: action.payload.data
      };
    default:
      return state;
  }
};

// Actions

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
export const getCirosByNobetci = fromDate => {
  let requestUrl = `api/reports/ciro/by-nobetci`;
  if (fromDate) {
    requestUrl += `?fromDate=${fromDate}`;
  }
  return {
    type: ACTION_TYPES.FETCH_CIROS_BY_NOBETCI,
    payload: axios.get(requestUrl)
  };
};
