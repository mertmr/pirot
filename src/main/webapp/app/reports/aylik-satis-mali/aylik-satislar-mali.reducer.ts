import axios from 'axios';

import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { defaultValue } from 'app/shared/model/aylis-satislar-mali.model';

export const ACTION_TYPES = {
  FETCH_AYLIK_SATISLARS: 'aylikSatisMalilar/FETCH_AYLIK_SATISLARS',
};

const initialState = {
  loading: false,
  errorMessage: null,
  aylikSatisMalilar: defaultValue,
};

export type AylikSatisMalilarState = Readonly<typeof initialState>;

// Reducer

export default (state: AylikSatisMalilarState = initialState, action): AylikSatisMalilarState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_AYLIK_SATISLARS):
      return {
        ...state,
        errorMessage: null,
        loading: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_AYLIK_SATISLARS):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_AYLIK_SATISLARS):
      return {
        ...state,
        loading: false,
        aylikSatisMalilar: action.payload.data,
      };
    default:
      return state;
  }
};

// Actions

export const getAylikSatisMalilars = () => {
  const requestUrl = `api/satis-stok-hareketleris/getMaliSatisRaporlari`;
  return {
    type: ACTION_TYPES.FETCH_AYLIK_SATISLARS,
    payload: axios.get(requestUrl),
  };
};
