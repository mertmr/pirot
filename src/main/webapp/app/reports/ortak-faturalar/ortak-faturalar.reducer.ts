import axios from 'axios';

import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { defaultValue, IOrtakFatura } from 'app/shared/model/ortakfatura/ortak-fatura.model';
import { IOrtakFaturaDetay } from 'app/shared/model/ortakfatura/ortak-fatura-detay.model';
import { IKisiler } from 'app/shared/model/kisiler.model';
import { IReportDates } from 'app/shared/model/ortakfatura/report-dates.model';

export const ACTION_TYPES = {
  FETCH_ORTAK_FATURALAR: 'Report/FETCH_ORTAK_FATURALAR',
  FETCH_REPORT_DATES: 'Report/FETCH_REPORT_DATES',
  FETCH_ORTAK_FATURALAR_DETAY: 'Report/FETCH_ORTAK_FATURALAR_DETAY',
  REPORT_DATE: 'Report/REPORT_DATE',
  RESET: 'urunFiyat/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  ortakFaturaKisiList: [] as ReadonlyArray<IKisiler>,
  reportDateList: [] as Array<IReportDates>,
  ortakFaturaDetaylar: defaultValue,
  totalItems: 0,
  reportDate: ''
};

export type OrtakFaturaState = Readonly<typeof initialState>;

// Reducer

export default (state: OrtakFaturaState = initialState, action): OrtakFaturaState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_REPORT_DATES):
    case REQUEST(ACTION_TYPES.FETCH_ORTAK_FATURALAR_DETAY):
    case REQUEST(ACTION_TYPES.REPORT_DATE):
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
    case ACTION_TYPES.REPORT_DATE:
      return {
        ...state,
        loading: false,
        reportDate: action.reportDate
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState
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

export const getOrtakFaturaDetaylar = reportDateKisiId => {
  const kisiId = reportDateKisiId.split('_')[0];
  const reportDate = reportDateKisiId.split('_')[1];
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

export const setReportDate = reportDate => ({
  type: ACTION_TYPES.REPORT_DATE,
  reportDate
});
