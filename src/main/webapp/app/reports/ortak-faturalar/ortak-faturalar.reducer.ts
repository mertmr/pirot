import axios from 'axios';

import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { IOrtakFatura } from 'app/shared/model/ortakfatura/ortak-fatura.model';
import { IOrtakFaturaDetay } from 'app/shared/model/ortakfatura/ortak-fatura-detay.model';
import { IKisiler } from 'app/shared/model/kisiler.model';
import { IReportDates } from 'app/shared/model/ortakfatura/report-dates.model';

export const ACTION_TYPES = {
  FETCH_ORTAK_FATURALAR: 'Report/FETCH_ORTAK_FATURALAR',
  FETCH_REPORT_DATES: 'Report/FETCH_REPORT_DATES',
  FETCH_ORTAK_FATURALAR_DETAY: 'Report/FETCH_ORTAK_FATURALAR_DETAY'
};

const initialState = {
  loading: false,
  errorMessage: null,
  ortakFaturaKisiList: [] as ReadonlyArray<IKisiler>,
  reportDateList: [] as Array<IReportDates>,
  ortakFaturaDetaylar: [] as ReadonlyArray<IOrtakFaturaDetay>,
  totalItems: 0
};

export type OrtakFaturaState = Readonly<typeof initialState>;

// Reducer

export default (state: OrtakFaturaState = initialState, action): OrtakFaturaState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_REPORT_DATES):
    case REQUEST(ACTION_TYPES.FETCH_ORTAK_FATURALAR_DETAY):
    case REQUEST(ACTION_TYPES.FETCH_ORTAK_FATURALAR):
      return {
        ...state,
        errorMessage: null,
        loading: true
      };
    case FAILURE(ACTION_TYPES.FETCH_REPORT_DATES):
    case FAILURE(ACTION_TYPES.FETCH_ORTAK_FATURALAR_DETAY):
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
        ortakFaturaKisiList: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_ORTAK_FATURALAR_DETAY):
      return {
        ...state,
        loading: false,
        ortakFaturaDetaylar: action.payload.data
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
  const requestUrl = `api/reports/ortak-fatura-kisi-list?reportDate=${reportDate}`;
  return {
    type: ACTION_TYPES.FETCH_ORTAK_FATURALAR,
    payload: axios.get(requestUrl)
  };
};

export const getOrtakFaturaDetaylar = (reportDate, kisiId) => {
  const requestUrl = `api/reports/ortak-fatura-kisi-ay?&reportDate=${reportDate}&kisiId=${kisiId}`;
  return {
    type: ACTION_TYPES.FETCH_ORTAK_FATURALAR_DETAY,
    payload: axios.get(requestUrl)
  };
};

export const getReportDateList = () => {
  const requestUrl = `api/reports/report-date-list`;
  return {
    type: ACTION_TYPES.FETCH_REPORT_DATES,
    payload: axios.get(requestUrl)
  };
};
