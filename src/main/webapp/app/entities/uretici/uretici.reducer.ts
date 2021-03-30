import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IUretici, defaultValue } from 'app/shared/model/uretici.model';

export const ACTION_TYPES = {
  FETCH_URETICI_LIST: 'uretici/FETCH_URETICI_LIST',
  FETCH_URETICI: 'uretici/FETCH_URETICI',
  CREATE_URETICI: 'uretici/CREATE_URETICI',
  UPDATE_URETICI: 'uretici/UPDATE_URETICI',
  PARTIAL_UPDATE_URETICI: 'uretici/PARTIAL_UPDATE_URETICI',
  DELETE_URETICI: 'uretici/DELETE_URETICI',
  RESET: 'uretici/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IUretici>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type UreticiState = Readonly<typeof initialState>;

// Reducer

export default (state: UreticiState = initialState, action): UreticiState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_URETICI_LIST):
    case REQUEST(ACTION_TYPES.FETCH_URETICI):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_URETICI):
    case REQUEST(ACTION_TYPES.UPDATE_URETICI):
    case REQUEST(ACTION_TYPES.DELETE_URETICI):
    case REQUEST(ACTION_TYPES.PARTIAL_UPDATE_URETICI):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_URETICI_LIST):
    case FAILURE(ACTION_TYPES.FETCH_URETICI):
    case FAILURE(ACTION_TYPES.CREATE_URETICI):
    case FAILURE(ACTION_TYPES.UPDATE_URETICI):
    case FAILURE(ACTION_TYPES.PARTIAL_UPDATE_URETICI):
    case FAILURE(ACTION_TYPES.DELETE_URETICI):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_URETICI_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_URETICI):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_URETICI):
    case SUCCESS(ACTION_TYPES.UPDATE_URETICI):
    case SUCCESS(ACTION_TYPES.PARTIAL_UPDATE_URETICI):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_URETICI):
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

const apiUrl = 'api/ureticis';

// Actions

export const getEntities: ICrudGetAllAction<IUretici> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_URETICI_LIST,
    payload: axios.get<IUretici>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IUretici> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_URETICI,
    payload: axios.get<IUretici>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IUretici> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_URETICI,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IUretici> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_URETICI,
    payload: axios.put(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const partialUpdate: ICrudPutAction<IUretici> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.PARTIAL_UPDATE_URETICI,
    payload: axios.patch(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IUretici> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_URETICI,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
