import axios from 'axios';

import { FAILURE, REQUEST, SUCCESS } from 'app/shared/reducers/action-type.util';
import { defaultValue } from 'app/shared/model/tukenme.model';

export const ACTION_TYPES = {
  FETCH_TUKENME_HIZI: 'Report/FETCH_TUKENME_HIZI',
};

const initialState = {
  loading: false,
  errorMessage: null,
  fromDateProp: null,
  toDateProp: null,
  totalItems: 0,
  tukenme: defaultValue,
};

export type TukenmeState = Readonly<typeof initialState>;

// Reducer

export default (state: TukenmeState = initialState, action): TukenmeState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_TUKENME_HIZI):
      return {
        ...state,
        errorMessage: null,
        loading: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_TUKENME_HIZI):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_TUKENME_HIZI):
      return {
        ...state,
        loading: false,
        tukenme: action.payload.data,
      };
    default:
      return state;
  }
};

// Actions

export const getTukenmeHizi = (stokGirisiDate, urunId) => {
  let requestUrl = `api/reports/urunTukenmeHizi`;
  requestUrl += `?stokGirisiDate=${stokGirisiDate}`;
  requestUrl += `&urunId=${urunId}`;
  return {
    type: ACTION_TYPES.FETCH_TUKENME_HIZI,
    payload: axios.get(requestUrl),
  };
};
