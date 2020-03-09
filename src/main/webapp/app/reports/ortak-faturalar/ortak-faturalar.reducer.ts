import axios from 'axios';

import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

export const ACTION_TYPES = {
  FETCH_ORTAK_FATURALAR: 'Report/FETCH_ORTAK_FATURALAR',
  FETCH_REPORT_DATES: 'Report/FETCH_REPORT_DATES'
};

const initialState = {
  loading: false,
  errorMessage: null,
  ortakFaturas: [],
  reportDateList: [],
  totalItems: 0
};

export type OrtakFaturaState = Readonly<typeof initialState>;

// Reducer

export default (state: OrtakFaturaState = initialState, action): OrtakFaturaState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_REPORT_DATES):
    case REQUEST(ACTION_TYPES.FETCH_ORTAK_FATURALAR):
      return {
        ...state,
        errorMessage: null,
        loading: true
      };
    case FAILURE(ACTION_TYPES.FETCH_REPORT_DATES):
    case FAILURE(ACTION_TYPES.FETCH_ORTAK_FATURALAR):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_ORTAK_FATURALAR):
      return {
        ...state,
        loading: false,
        ortakFaturas: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_REPORT_DATES):
      return {
        ...state,
        loading: false,
        reportDateList: action.payload.data
      };
    default:
      return state;
  }
};

// Actions

export const getOrtakFaturas = reportDate => {
  let requestUrl = `api/reports/ortakFatura`;
  if (reportDate) {
    requestUrl += `&reportDate=${reportDate}`;
  }
  return {
    type: ACTION_TYPES.FETCH_ORTAK_FATURALAR,
    payload: axios.get(requestUrl)
  };
};

export const getReportDateList = reportDate => {
  let requestUrl = `api/reports/report-date-list`;
  if (reportDate) {
    requestUrl += `&reportDate=${reportDate}`;
  }
  return {
    type: ACTION_TYPES.FETCH_ORTAK_FATURALAR,
    payload: axios.get(requestUrl)
  };
};
