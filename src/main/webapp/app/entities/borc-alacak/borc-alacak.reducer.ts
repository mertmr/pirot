import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IBorcAlacak, defaultValue } from 'app/shared/model/borc-alacak.model';

export const ACTION_TYPES = {
  FETCH_BORCALACAK_LIST: 'borcAlacak/FETCH_BORCALACAK_LIST',
  FETCH_BORCALACAK: 'borcAlacak/FETCH_BORCALACAK',
  CREATE_BORCALACAK: 'borcAlacak/CREATE_BORCALACAK',
  UPDATE_BORCALACAK: 'borcAlacak/UPDATE_BORCALACAK',
  DELETE_BORCALACAK: 'borcAlacak/DELETE_BORCALACAK',
  RESET: 'borcAlacak/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IBorcAlacak>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false
};

export type BorcAlacakState = Readonly<typeof initialState>;

// Reducer

export default (state: BorcAlacakState = initialState, action): BorcAlacakState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_BORCALACAK_LIST):
    case REQUEST(ACTION_TYPES.FETCH_BORCALACAK):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_BORCALACAK):
    case REQUEST(ACTION_TYPES.UPDATE_BORCALACAK):
    case REQUEST(ACTION_TYPES.DELETE_BORCALACAK):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_BORCALACAK_LIST):
    case FAILURE(ACTION_TYPES.FETCH_BORCALACAK):
    case FAILURE(ACTION_TYPES.CREATE_BORCALACAK):
    case FAILURE(ACTION_TYPES.UPDATE_BORCALACAK):
    case FAILURE(ACTION_TYPES.DELETE_BORCALACAK):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_BORCALACAK_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10)
      };
    case SUCCESS(ACTION_TYPES.FETCH_BORCALACAK):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_BORCALACAK):
    case SUCCESS(ACTION_TYPES.UPDATE_BORCALACAK):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_BORCALACAK):
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

const apiUrl = 'api/borc-alacaks';

// Actions

export const getEntities: ICrudGetAllAction<IBorcAlacak> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_BORCALACAK_LIST,
    payload: axios.get<IBorcAlacak>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getEntity: ICrudGetAction<IBorcAlacak> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_BORCALACAK,
    payload: axios.get<IBorcAlacak>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<IBorcAlacak> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_BORCALACAK,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IBorcAlacak> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_BORCALACAK,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IBorcAlacak> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_BORCALACAK,
    payload: axios.delete(requestUrl)
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
