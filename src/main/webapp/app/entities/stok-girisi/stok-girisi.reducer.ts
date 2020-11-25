import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction, ICrudSearchAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IStokGirisi, defaultValue } from 'app/shared/model/stok-girisi.model';

export const ACTION_TYPES = {
  SEARCH_STOKGIRISI_BY_URUN: 'urun/SEARCH_STOKGIRISI_BY_URUN',
  FETCH_STOKGIRISI_LIST: 'stokGirisi/FETCH_STOKGIRISI_LIST',
  FETCH_STOKGIRISI: 'stokGirisi/FETCH_STOKGIRISI',
  CREATE_STOKGIRISI: 'stokGirisi/CREATE_STOKGIRISI',
  UPDATE_STOKGIRISI: 'stokGirisi/UPDATE_STOKGIRISI',
  DELETE_STOKGIRISI: 'stokGirisi/DELETE_STOKGIRISI',
  RESET: 'stokGirisi/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IStokGirisi>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type StokGirisiState = Readonly<typeof initialState>;

// Reducer

export default (state: StokGirisiState = initialState, action): StokGirisiState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.SEARCH_STOKGIRISI_BY_URUN):
    case REQUEST(ACTION_TYPES.FETCH_STOKGIRISI_LIST):
    case REQUEST(ACTION_TYPES.FETCH_STOKGIRISI):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_STOKGIRISI):
    case REQUEST(ACTION_TYPES.UPDATE_STOKGIRISI):
    case REQUEST(ACTION_TYPES.DELETE_STOKGIRISI):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.SEARCH_STOKGIRISI_BY_URUN):
    case FAILURE(ACTION_TYPES.FETCH_STOKGIRISI_LIST):
    case FAILURE(ACTION_TYPES.FETCH_STOKGIRISI):
    case FAILURE(ACTION_TYPES.CREATE_STOKGIRISI):
    case FAILURE(ACTION_TYPES.UPDATE_STOKGIRISI):
    case FAILURE(ACTION_TYPES.DELETE_STOKGIRISI):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.SEARCH_STOKGIRISI_BY_URUN):
    case SUCCESS(ACTION_TYPES.FETCH_STOKGIRISI_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_STOKGIRISI):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_STOKGIRISI):
    case SUCCESS(ACTION_TYPES.UPDATE_STOKGIRISI):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_STOKGIRISI):
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

const apiUrl = 'api/stok-girisis';
const apiSearchUrl = 'api/searchStokGirisiByUrun';

// Actions

export const searchStokGirisiByUrun: ICrudSearchAction<IStokGirisi> = (query, page, size, sort) => ({
  type: ACTION_TYPES.SEARCH_STOKGIRISI_BY_URUN,
  payload: axios.get<IStokGirisi>(`${apiSearchUrl}?query=${query}${sort ? `&page=${page}&size=${size}&sort=${sort}` : ''}`),
});

export const getEntities: ICrudGetAllAction<IStokGirisi> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_STOKGIRISI_LIST,
    payload: axios.get<IStokGirisi>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IStokGirisi> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_STOKGIRISI,
    payload: axios.get<IStokGirisi>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IStokGirisi> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_STOKGIRISI,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const updateEntity: ICrudPutAction<IStokGirisi> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_STOKGIRISI,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IStokGirisi> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_STOKGIRISI,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
