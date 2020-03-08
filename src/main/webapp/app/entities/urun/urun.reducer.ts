import axios from 'axios';
import { ICrudSearchAction, ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IUrun, defaultValue } from 'app/shared/model/urun.model';
import { IUser } from 'app/shared/model/user.model';

export const ACTION_TYPES = {
  SEARCH_URUNS: 'urun/SEARCH_URUNS',
  FETCH_URUN_LIST: 'urun/FETCH_URUN_LIST',
  FETCH_URUN_USER_LIST: 'urun/FETCH_URUN_USER_LIST',
  FETCH_URUN_SATIS_LIST: 'urun/FETCH_URUN_SATIS_LIST',
  FETCH_URUN: 'urun/FETCH_URUN',
  CREATE_URUN: 'urun/CREATE_URUN',
  UPDATE_URUN: 'urun/UPDATE_URUN',
  DELETE_URUN: 'urun/DELETE_URUN',
  RESET: 'urun/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IUrun>,
  users: [] as Array<IUser>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
  satisUrunleri: [] as Array<IUrun>
};

export type UrunState = Readonly<typeof initialState>;

// Reducer

export default (state: UrunState = initialState, action): UrunState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.SEARCH_URUNS):
    case REQUEST(ACTION_TYPES.FETCH_URUN_LIST):
    case REQUEST(ACTION_TYPES.FETCH_URUN_USER_LIST):
    case REQUEST(ACTION_TYPES.FETCH_URUN_SATIS_LIST):
    case REQUEST(ACTION_TYPES.FETCH_URUN):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_URUN):
    case REQUEST(ACTION_TYPES.UPDATE_URUN):
    case REQUEST(ACTION_TYPES.DELETE_URUN):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.SEARCH_URUNS):
    case FAILURE(ACTION_TYPES.FETCH_URUN_LIST):
    case FAILURE(ACTION_TYPES.FETCH_URUN_USER_LIST):
    case FAILURE(ACTION_TYPES.FETCH_URUN_SATIS_LIST):
    case FAILURE(ACTION_TYPES.FETCH_URUN):
    case FAILURE(ACTION_TYPES.CREATE_URUN):
    case FAILURE(ACTION_TYPES.UPDATE_URUN):
    case FAILURE(ACTION_TYPES.DELETE_URUN):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.SEARCH_URUNS):
    case SUCCESS(ACTION_TYPES.FETCH_URUN_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10)
      };
    case SUCCESS(ACTION_TYPES.FETCH_URUN_USER_LIST):
      return {
        ...state,
        loading: false,
        users: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_URUN_SATIS_LIST):
      return {
        ...state,
        satisUrunleri: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_URUN):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_URUN):
    case SUCCESS(ACTION_TYPES.UPDATE_URUN):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_URUN):
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

const apiUrl = 'api/uruns';
const apiSearchUrl = 'api/_search/uruns';

// Actions

export const getSearchEntities: ICrudSearchAction<IUrun> = (query, page, size, sort) => ({
  type: ACTION_TYPES.SEARCH_URUNS,
  payload: axios.get<IUrun>(`${apiSearchUrl}?query=${query}${sort ? `&page=${page}&size=${size}&sort=${sort}` : ''}`)
});

export const getEntities: ICrudGetAllAction<IUrun> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_URUN_LIST,
    payload: axios.get<IUrun>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getUrunUsers: ICrudGetAllAction<IUrun> = () => {
  const requestUrl = `api/users/findAll`;
  return {
    type: ACTION_TYPES.FETCH_URUN_USER_LIST,
    payload: axios.get<IUser>(`${requestUrl}`)
  };
};

export const getSatisUrunleri: ICrudGetAllAction<IUrun> = () => {
  const requestUrl = `${apiUrl}/satis`;
  return {
    type: ACTION_TYPES.FETCH_URUN_SATIS_LIST,
    payload: axios.get<IUrun>(`${requestUrl}`)
  };
};

export const getEntity: ICrudGetAction<IUrun> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_URUN,
    payload: axios.get<IUrun>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<IUrun> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_URUN,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IUrun> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_URUN,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IUrun> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_URUN,
    payload: axios.delete(requestUrl)
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
