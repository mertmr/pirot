import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ISatisStokHareketleri, defaultValue } from 'app/shared/model/satis-stok-hareketleri.model';

export const ACTION_TYPES = {
  FETCH_SATISSTOKHAREKETLERI_LIST: 'satisStokHareketleri/FETCH_SATISSTOKHAREKETLERI_LIST',
  FETCH_SATISSTOKHAREKETLERI: 'satisStokHareketleri/FETCH_SATISSTOKHAREKETLERI',
  CREATE_SATISSTOKHAREKETLERI: 'satisStokHareketleri/CREATE_SATISSTOKHAREKETLERI',
  UPDATE_SATISSTOKHAREKETLERI: 'satisStokHareketleri/UPDATE_SATISSTOKHAREKETLERI',
  DELETE_SATISSTOKHAREKETLERI: 'satisStokHareketleri/DELETE_SATISSTOKHAREKETLERI',
  RESET: 'satisStokHareketleri/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ISatisStokHareketleri>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false
};

export type SatisStokHareketleriState = Readonly<typeof initialState>;

// Reducer

export default (state: SatisStokHareketleriState = initialState, action): SatisStokHareketleriState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_SATISSTOKHAREKETLERI_LIST):
    case REQUEST(ACTION_TYPES.FETCH_SATISSTOKHAREKETLERI):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_SATISSTOKHAREKETLERI):
    case REQUEST(ACTION_TYPES.UPDATE_SATISSTOKHAREKETLERI):
    case REQUEST(ACTION_TYPES.DELETE_SATISSTOKHAREKETLERI):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_SATISSTOKHAREKETLERI_LIST):
    case FAILURE(ACTION_TYPES.FETCH_SATISSTOKHAREKETLERI):
    case FAILURE(ACTION_TYPES.CREATE_SATISSTOKHAREKETLERI):
    case FAILURE(ACTION_TYPES.UPDATE_SATISSTOKHAREKETLERI):
    case FAILURE(ACTION_TYPES.DELETE_SATISSTOKHAREKETLERI):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_SATISSTOKHAREKETLERI_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10)
      };
    case SUCCESS(ACTION_TYPES.FETCH_SATISSTOKHAREKETLERI):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_SATISSTOKHAREKETLERI):
    case SUCCESS(ACTION_TYPES.UPDATE_SATISSTOKHAREKETLERI):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_SATISSTOKHAREKETLERI):
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

const apiUrl = 'api/satis-stok-hareketleris';

// Actions

export const getEntities: ICrudGetAllAction<ISatisStokHareketleri> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_SATISSTOKHAREKETLERI_LIST,
    payload: axios.get<ISatisStokHareketleri>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getEntity: ICrudGetAction<ISatisStokHareketleri> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_SATISSTOKHAREKETLERI,
    payload: axios.get<ISatisStokHareketleri>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<ISatisStokHareketleri> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_SATISSTOKHAREKETLERI,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ISatisStokHareketleri> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_SATISSTOKHAREKETLERI,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const deleteEntity: ICrudDeleteAction<ISatisStokHareketleri> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_SATISSTOKHAREKETLERI,
    payload: axios.delete(requestUrl)
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
