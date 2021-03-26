import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IKisiler, defaultValue } from 'app/shared/model/kisiler.model';

export const ACTION_TYPES = {
  FETCH_KISILER_LIST: 'kisiler/FETCH_KISILER_LIST',
  FETCH_KISILER: 'kisiler/FETCH_KISILER',
  CREATE_KISILER: 'kisiler/CREATE_KISILER',
  UPDATE_KISILER: 'kisiler/UPDATE_KISILER',
  DELETE_KISILER: 'kisiler/DELETE_KISILER',
  RESET: 'kisiler/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IKisiler>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type KisilerState = Readonly<typeof initialState>;

// Reducer

export default (state: KisilerState = initialState, action): KisilerState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_KISILER_LIST):
    case REQUEST(ACTION_TYPES.FETCH_KISILER):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_KISILER):
    case REQUEST(ACTION_TYPES.UPDATE_KISILER):
    case REQUEST(ACTION_TYPES.DELETE_KISILER):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_KISILER_LIST):
    case FAILURE(ACTION_TYPES.FETCH_KISILER):
    case FAILURE(ACTION_TYPES.CREATE_KISILER):
    case FAILURE(ACTION_TYPES.UPDATE_KISILER):
    case FAILURE(ACTION_TYPES.DELETE_KISILER):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_KISILER_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_KISILER):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_KISILER):
    case SUCCESS(ACTION_TYPES.UPDATE_KISILER):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_KISILER):
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

const apiUrl = 'api/kisilers';

// Actions

export const getEntities: ICrudGetAllAction<IKisiler> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_KISILER_LIST,
    payload: axios.get<IKisiler>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IKisiler> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_KISILER,
    payload: axios.get<IKisiler>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IKisiler> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_KISILER,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IKisiler> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_KISILER,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IKisiler> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_KISILER,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
