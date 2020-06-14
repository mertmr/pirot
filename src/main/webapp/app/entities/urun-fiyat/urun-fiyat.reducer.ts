import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IUrunFiyat, defaultValue } from 'app/shared/model/urun-fiyat.model';

export const ACTION_TYPES = {
  FETCH_URUNFIYAT_LIST: 'urunFiyat/FETCH_URUNFIYAT_LIST',
  FETCH_URUNFIYAT: 'urunFiyat/FETCH_URUNFIYAT',
  CREATE_URUNFIYAT: 'urunFiyat/CREATE_URUNFIYAT',
  UPDATE_URUNFIYAT: 'urunFiyat/UPDATE_URUNFIYAT',
  DELETE_URUNFIYAT: 'urunFiyat/DELETE_URUNFIYAT',
  RESET: 'urunFiyat/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IUrunFiyat>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type UrunFiyatState = Readonly<typeof initialState>;

// Reducer

export default (state: UrunFiyatState = initialState, action): UrunFiyatState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_URUNFIYAT_LIST):
    case REQUEST(ACTION_TYPES.FETCH_URUNFIYAT):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_URUNFIYAT):
    case REQUEST(ACTION_TYPES.UPDATE_URUNFIYAT):
    case REQUEST(ACTION_TYPES.DELETE_URUNFIYAT):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_URUNFIYAT_LIST):
    case FAILURE(ACTION_TYPES.FETCH_URUNFIYAT):
    case FAILURE(ACTION_TYPES.CREATE_URUNFIYAT):
    case FAILURE(ACTION_TYPES.UPDATE_URUNFIYAT):
    case FAILURE(ACTION_TYPES.DELETE_URUNFIYAT):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_URUNFIYAT_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_URUNFIYAT):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_URUNFIYAT):
    case SUCCESS(ACTION_TYPES.UPDATE_URUNFIYAT):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_URUNFIYAT):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {},
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

const apiUrl = 'api/urun-fiyats';

// Actions

export const getEntities: ICrudGetAllAction<IUrunFiyat> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_URUNFIYAT_LIST,
    payload: axios.get<IUrunFiyat>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IUrunFiyat> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_URUNFIYAT,
    payload: axios.get<IUrunFiyat>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IUrunFiyat> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_URUNFIYAT,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IUrunFiyat> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_URUNFIYAT,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IUrunFiyat> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_URUNFIYAT,
    payload: axios.delete(requestUrl),
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
