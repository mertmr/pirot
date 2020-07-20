import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IKasaHareketleri, defaultValue } from 'app/shared/model/kasa-hareketleri.model';

export const ACTION_TYPES = {
  FETCH_KASAHAREKETLERI_LIST: 'kasaHareketleri/FETCH_KASAHAREKETLERI_LIST',
  FETCH_KASAHAREKETLERI: 'kasaHareketleri/FETCH_KASAHAREKETLERI',
  CREATE_KASAHAREKETLERI: 'kasaHareketleri/CREATE_KASAHAREKETLERI',
  UPDATE_KASAHAREKETLERI: 'kasaHareketleri/UPDATE_KASAHAREKETLERI',
  DELETE_KASAHAREKETLERI: 'kasaHareketleri/DELETE_KASAHAREKETLERI',
  RESET: 'kasaHareketleri/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IKasaHareketleri>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type KasaHareketleriState = Readonly<typeof initialState>;

// Reducer

export default (state: KasaHareketleriState = initialState, action): KasaHareketleriState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_KASAHAREKETLERI_LIST):
    case REQUEST(ACTION_TYPES.FETCH_KASAHAREKETLERI):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_KASAHAREKETLERI):
    case REQUEST(ACTION_TYPES.UPDATE_KASAHAREKETLERI):
    case REQUEST(ACTION_TYPES.DELETE_KASAHAREKETLERI):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_KASAHAREKETLERI_LIST):
    case FAILURE(ACTION_TYPES.FETCH_KASAHAREKETLERI):
    case FAILURE(ACTION_TYPES.CREATE_KASAHAREKETLERI):
    case FAILURE(ACTION_TYPES.UPDATE_KASAHAREKETLERI):
    case FAILURE(ACTION_TYPES.DELETE_KASAHAREKETLERI):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_KASAHAREKETLERI_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_KASAHAREKETLERI):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_KASAHAREKETLERI):
    case SUCCESS(ACTION_TYPES.UPDATE_KASAHAREKETLERI):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_KASAHAREKETLERI):
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

const apiUrl = 'api/kasa-hareketleris';

// Actions

export const getEntities: ICrudGetAllAction<IKasaHareketleri> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_KASAHAREKETLERI_LIST,
    payload: axios.get<IKasaHareketleri>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IKasaHareketleri> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_KASAHAREKETLERI,
    payload: axios.get<IKasaHareketleri>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IKasaHareketleri> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_KASAHAREKETLERI,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IKasaHareketleri> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_KASAHAREKETLERI,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IKasaHareketleri> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_KASAHAREKETLERI,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
