import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ISatis, defaultValue } from 'app/shared/model/satis.model';

export const ACTION_TYPES = {
  FETCH_SATIS_LIST: 'satis/FETCH_SATIS_LIST',
  FETCH_SATIS: 'satis/FETCH_SATIS',
  CREATE_SATIS: 'satis/CREATE_SATIS',
  UPDATE_SATIS: 'satis/UPDATE_SATIS',
  DELETE_SATIS: 'satis/DELETE_SATIS',
  RESET: 'satis/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ISatis>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type SatisState = Readonly<typeof initialState>;

// Reducer

export default (state: SatisState = initialState, action): SatisState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_SATIS_LIST):
    case REQUEST(ACTION_TYPES.FETCH_SATIS):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_SATIS):
    case REQUEST(ACTION_TYPES.UPDATE_SATIS):
    case REQUEST(ACTION_TYPES.DELETE_SATIS):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_SATIS_LIST):
    case FAILURE(ACTION_TYPES.FETCH_SATIS):
    case FAILURE(ACTION_TYPES.CREATE_SATIS):
    case FAILURE(ACTION_TYPES.UPDATE_SATIS):
    case FAILURE(ACTION_TYPES.DELETE_SATIS):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_SATIS_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_SATIS):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_SATIS):
    case SUCCESS(ACTION_TYPES.UPDATE_SATIS):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_SATIS):
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

const apiUrl = 'api/satis';

// Actions

export const getEntities: ICrudGetAllAction<ISatis> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_SATIS_LIST,
    payload: axios.get<ISatis>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<ISatis> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_SATIS,
    payload: axios.get<ISatis>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<ISatis> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_SATIS,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ISatis> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_SATIS,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ISatis> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_SATIS,
    payload: axios.delete(requestUrl),
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
