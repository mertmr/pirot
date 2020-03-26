import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IUrunFiyatHesap, defaultValue } from 'app/shared/model/urun-fiyat-hesap.model';

export const ACTION_TYPES = {
  FETCH_URUNFIYATHESAP_LIST: 'urunFiyatHesap/FETCH_URUNFIYATHESAP_LIST',
  FETCH_URUNFIYATHESAP: 'urunFiyatHesap/FETCH_URUNFIYATHESAP',
  CREATE_URUNFIYATHESAP: 'urunFiyatHesap/CREATE_URUNFIYATHESAP',
  UPDATE_URUNFIYATHESAP: 'urunFiyatHesap/UPDATE_URUNFIYATHESAP',
  DELETE_URUNFIYATHESAP: 'urunFiyatHesap/DELETE_URUNFIYATHESAP',
  RESET: 'urunFiyatHesap/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IUrunFiyatHesap>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false
};

export type UrunFiyatHesapState = Readonly<typeof initialState>;

// Reducer

export default (state: UrunFiyatHesapState = initialState, action): UrunFiyatHesapState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_URUNFIYATHESAP_LIST):
    case REQUEST(ACTION_TYPES.FETCH_URUNFIYATHESAP):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_URUNFIYATHESAP):
    case REQUEST(ACTION_TYPES.UPDATE_URUNFIYATHESAP):
    case REQUEST(ACTION_TYPES.DELETE_URUNFIYATHESAP):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_URUNFIYATHESAP_LIST):
    case FAILURE(ACTION_TYPES.FETCH_URUNFIYATHESAP):
    case FAILURE(ACTION_TYPES.CREATE_URUNFIYATHESAP):
    case FAILURE(ACTION_TYPES.UPDATE_URUNFIYATHESAP):
    case FAILURE(ACTION_TYPES.DELETE_URUNFIYATHESAP):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_URUNFIYATHESAP_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10)
      };
    case SUCCESS(ACTION_TYPES.FETCH_URUNFIYATHESAP):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_URUNFIYATHESAP):
    case SUCCESS(ACTION_TYPES.UPDATE_URUNFIYATHESAP):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_URUNFIYATHESAP):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {}
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

const apiUrl = 'api/urun-fiyat-hesaps';

// Actions

export const getEntities: ICrudGetAllAction<IUrunFiyatHesap> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_URUNFIYATHESAP_LIST,
    payload: axios.get<IUrunFiyatHesap>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getEntity: ICrudGetAction<IUrunFiyatHesap> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_URUNFIYATHESAP,
    payload: axios.get<IUrunFiyatHesap>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<IUrunFiyatHesap> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_URUNFIYATHESAP,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IUrunFiyatHesap> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_URUNFIYATHESAP,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IUrunFiyatHesap> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_URUNFIYATHESAP,
    payload: axios.delete(requestUrl)
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
