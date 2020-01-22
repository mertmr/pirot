import axios from 'axios';

import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { defaultValue } from 'app/shared/model/aylis-satislar.model';

export const ACTION_TYPES = {
  FETCH_AYLIK_SATISLARS: 'aylikSatislar/FETCH_AYLIK_SATISLARS'
};

const initialState = {
  loading: false,
  errorMessage: null,
  aylikSatislar: defaultValue
};

export type AylikSatislarState = Readonly<typeof initialState>;

// Reducer

export default (state: AylikSatislarState = initialState, action): AylikSatislarState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_AYLIK_SATISLARS):
      return {
        ...state,
        errorMessage: null,
        loading: true
      };
    case FAILURE(ACTION_TYPES.FETCH_AYLIK_SATISLARS):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_AYLIK_SATISLARS):
      return {
        ...state,
        loading: false,
        aylikSatislar: action.payload.data
      };
    default:
      return state;
  }
};

// Actions

export const getAylikSatislars = () => {
  const requestUrl = `api/satis-stok-hareketleris/getSatisRaporlari`;
  return {
    type: ACTION_TYPES.FETCH_AYLIK_SATISLARS,
    payload: axios.get(requestUrl)
  };
};
