import axios from 'axios';
import { ICrudDeleteAction, ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudSearchAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { FAILURE, REQUEST, SUCCESS } from 'app/shared/reducers/action-type.util';

import { defaultValue, IVirman } from 'app/shared/model/virman.model';

export const ACTION_TYPES = {
  SEARCH_VIRMAN: 'satis/SEARCH_VIRMAN',
  FETCH_VIRMAN_LIST: 'virman/FETCH_VIRMAN_LIST',
  FETCH_VIRMAN: 'virman/FETCH_VIRMAN',
  FETCH_VIRMAN_USER: 'virman/FETCH_VIRMAN_USER',
  CREATE_VIRMAN: 'virman/CREATE_VIRMAN',
  UPDATE_VIRMAN: 'virman/UPDATE_VIRMAN',
  DELETE_VIRMAN: 'virman/DELETE_VIRMAN',
  RESET: 'virman/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IVirman>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type VirmanState = Readonly<typeof initialState>;

// Reducer

export default (state: VirmanState = initialState, action): VirmanState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.SEARCH_VIRMAN):
    case REQUEST(ACTION_TYPES.FETCH_VIRMAN_LIST):
    case REQUEST(ACTION_TYPES.FETCH_VIRMAN_USER):
    case REQUEST(ACTION_TYPES.FETCH_VIRMAN):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_VIRMAN):
    case REQUEST(ACTION_TYPES.UPDATE_VIRMAN):
    case REQUEST(ACTION_TYPES.DELETE_VIRMAN):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.SEARCH_VIRMAN):
    case FAILURE(ACTION_TYPES.FETCH_VIRMAN_LIST):
    case FAILURE(ACTION_TYPES.FETCH_VIRMAN):
    case FAILURE(ACTION_TYPES.FETCH_VIRMAN_USER):
    case FAILURE(ACTION_TYPES.CREATE_VIRMAN):
    case FAILURE(ACTION_TYPES.UPDATE_VIRMAN):
    case FAILURE(ACTION_TYPES.DELETE_VIRMAN):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.SEARCH_VIRMAN):
    case SUCCESS(ACTION_TYPES.FETCH_VIRMAN_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_VIRMAN_USER):
    case SUCCESS(ACTION_TYPES.FETCH_VIRMAN):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_VIRMAN):
    case SUCCESS(ACTION_TYPES.UPDATE_VIRMAN):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_VIRMAN):
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

const apiUrl = 'api/virmen';
const apiSearchUrl = 'api/_search/virman';

// Actions

export const getSearchEntities: ICrudSearchAction<IVirman> = (query, page, size, sort) => ({
  type: ACTION_TYPES.SEARCH_VIRMAN,
  payload: axios.get<IVirman>(`${apiSearchUrl}?query=${query}${sort ? `&page=${page}&size=${size}&sort=${sort}` : ''}`),
});

export const getEntities: ICrudGetAllAction<IVirman> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_VIRMAN_LIST,
    payload: axios.get<IVirman>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IVirman> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_VIRMAN,
    payload: axios.get<IVirman>(requestUrl),
  };
};

export const getVirmanUser = (fromDate, userId) => {
  let requestUrl = `${apiUrl}/user-virman`;
  requestUrl += `?fromDate=${fromDate}`;
  requestUrl += `&userId=${userId}`;
  return {
    type: ACTION_TYPES.FETCH_VIRMAN,
    payload: axios.get<IVirman>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IVirman> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_VIRMAN,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IVirman> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_VIRMAN,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IVirman> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_VIRMAN,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
