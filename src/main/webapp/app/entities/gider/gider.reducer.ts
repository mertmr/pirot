import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction, ICrudSearchAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IGider, defaultValue } from 'app/shared/model/gider.model';
import { ISatis } from 'app/shared/model/satis.model';

export const ACTION_TYPES = {
  SEARCH_GIDER: 'satis/SEARCH_GIDER',
  FETCH_GIDER_LIST: 'gider/FETCH_GIDER_LIST',
  FETCH_GIDER_USER_LIST: 'gider/FETCH_GIDER_USER_LIST',
  FETCH_GIDER: 'gider/FETCH_GIDER',
  CREATE_GIDER: 'gider/CREATE_GIDER',
  UPDATE_GIDER: 'gider/UPDATE_GIDER',
  PARTIAL_UPDATE_GIDER: 'gider/PARTIAL_UPDATE_GIDER',
  DELETE_GIDER: 'gider/DELETE_GIDER',
  RESET: 'gider/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IGider>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type GiderState = Readonly<typeof initialState>;

// Reducer

export default (state: GiderState = initialState, action): GiderState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.SEARCH_GIDER):
    case REQUEST(ACTION_TYPES.FETCH_GIDER_LIST):
    case REQUEST(ACTION_TYPES.FETCH_GIDER_USER_LIST):
    case REQUEST(ACTION_TYPES.FETCH_GIDER):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_GIDER):
    case REQUEST(ACTION_TYPES.UPDATE_GIDER):
    case REQUEST(ACTION_TYPES.DELETE_GIDER):
    case REQUEST(ACTION_TYPES.PARTIAL_UPDATE_GIDER):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.SEARCH_GIDER):
    case FAILURE(ACTION_TYPES.FETCH_GIDER_LIST):
    case FAILURE(ACTION_TYPES.FETCH_GIDER_USER_LIST):
    case FAILURE(ACTION_TYPES.FETCH_GIDER):
    case FAILURE(ACTION_TYPES.CREATE_GIDER):
    case FAILURE(ACTION_TYPES.UPDATE_GIDER):
    case FAILURE(ACTION_TYPES.PARTIAL_UPDATE_GIDER):
    case FAILURE(ACTION_TYPES.DELETE_GIDER):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.SEARCH_GIDER):
    case SUCCESS(ACTION_TYPES.FETCH_GIDER_USER_LIST):
    case SUCCESS(ACTION_TYPES.FETCH_GIDER_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_GIDER):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_GIDER):
    case SUCCESS(ACTION_TYPES.UPDATE_GIDER):
    case SUCCESS(ACTION_TYPES.PARTIAL_UPDATE_GIDER):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_GIDER):
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

const apiUrl = 'api/giders';
const apiSearchUrl = 'api/_search/gider';

// Actions

export const getSearchEntities: ICrudSearchAction<IGider> = (query, page, size, sort) => ({
  type: ACTION_TYPES.SEARCH_GIDER,
  payload: axios.get<IGider>(`${apiSearchUrl}?query=${query}${sort ? `&page=${page}&size=${size}&sort=${sort}` : ''}`),
});

export const getEntities: ICrudGetAllAction<IGider> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_GIDER_LIST,
    payload: axios.get<IGider>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IGider> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_GIDER,
    payload: axios.get<IGider>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IGider> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_GIDER,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IGider> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_GIDER,
    payload: axios.put(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const partialUpdate: ICrudPutAction<IGider> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.PARTIAL_UPDATE_GIDER,
    payload: axios.patch(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IGider> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_GIDER,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});

export const getUserGiders = (fromDate, userId) => {
  let requestUrl = `${apiUrl}/user-gider`;
  requestUrl += `?fromDate=${fromDate}`;
  requestUrl += `&userId=${userId}`;
  return {
    type: ACTION_TYPES.FETCH_GIDER_USER_LIST,
    payload: axios.get(`${requestUrl}`),
  };
};
