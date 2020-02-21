import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IKdvKategorisi, defaultValue } from 'app/shared/model/kdv-kategorisi.model';

export const ACTION_TYPES = {
  FETCH_KDVKATEGORISI_LIST: 'kdvKategorisi/FETCH_KDVKATEGORISI_LIST',
  FETCH_KDVKATEGORISI: 'kdvKategorisi/FETCH_KDVKATEGORISI',
  CREATE_KDVKATEGORISI: 'kdvKategorisi/CREATE_KDVKATEGORISI',
  UPDATE_KDVKATEGORISI: 'kdvKategorisi/UPDATE_KDVKATEGORISI',
  DELETE_KDVKATEGORISI: 'kdvKategorisi/DELETE_KDVKATEGORISI',
  RESET: 'kdvKategorisi/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IKdvKategorisi>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false
};

export type KdvKategorisiState = Readonly<typeof initialState>;

// Reducer

export default (state: KdvKategorisiState = initialState, action): KdvKategorisiState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_KDVKATEGORISI_LIST):
    case REQUEST(ACTION_TYPES.FETCH_KDVKATEGORISI):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_KDVKATEGORISI):
    case REQUEST(ACTION_TYPES.UPDATE_KDVKATEGORISI):
    case REQUEST(ACTION_TYPES.DELETE_KDVKATEGORISI):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_KDVKATEGORISI_LIST):
    case FAILURE(ACTION_TYPES.FETCH_KDVKATEGORISI):
    case FAILURE(ACTION_TYPES.CREATE_KDVKATEGORISI):
    case FAILURE(ACTION_TYPES.UPDATE_KDVKATEGORISI):
    case FAILURE(ACTION_TYPES.DELETE_KDVKATEGORISI):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_KDVKATEGORISI_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10)
      };
    case SUCCESS(ACTION_TYPES.FETCH_KDVKATEGORISI):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_KDVKATEGORISI):
    case SUCCESS(ACTION_TYPES.UPDATE_KDVKATEGORISI):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_KDVKATEGORISI):
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

const apiUrl = 'api/kdv-kategorisis';

// Actions

export const getEntities: ICrudGetAllAction<IKdvKategorisi> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_KDVKATEGORISI_LIST,
    payload: axios.get<IKdvKategorisi>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getEntity: ICrudGetAction<IKdvKategorisi> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_KDVKATEGORISI,
    payload: axios.get<IKdvKategorisi>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<IKdvKategorisi> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_KDVKATEGORISI,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IKdvKategorisi> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_KDVKATEGORISI,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const deleteEntity: ICrudDeleteAction<IKdvKategorisi> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_KDVKATEGORISI,
    payload: axios.delete(requestUrl)
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
