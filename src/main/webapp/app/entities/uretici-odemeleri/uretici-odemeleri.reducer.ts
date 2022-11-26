import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IUreticiOdemeleri, defaultValue } from 'app/shared/model/uretici-odemeleri.model';

export const ACTION_TYPES = {
  FETCH_URETICIODEMELERI_LIST: 'ureticiOdemeleri/FETCH_URETICIODEMELERI_LIST',
  FETCH_URETICIODEMELERI: 'ureticiOdemeleri/FETCH_URETICIODEMELERI',
  CREATE_URETICIODEMELERI: 'ureticiOdemeleri/CREATE_URETICIODEMELERI',
  UPDATE_URETICIODEMELERI: 'ureticiOdemeleri/UPDATE_URETICIODEMELERI',
  DELETE_URETICIODEMELERI: 'ureticiOdemeleri/DELETE_URETICIODEMELERI',
  RESET: 'ureticiOdemeleri/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IUreticiOdemeleri>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type UreticiOdemeleriState = Readonly<typeof initialState>;

// Reducer

export default (state: UreticiOdemeleriState = initialState, action): UreticiOdemeleriState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_URETICIODEMELERI_LIST):
    case REQUEST(ACTION_TYPES.FETCH_URETICIODEMELERI):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_URETICIODEMELERI):
    case REQUEST(ACTION_TYPES.UPDATE_URETICIODEMELERI):
    case REQUEST(ACTION_TYPES.DELETE_URETICIODEMELERI):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_URETICIODEMELERI_LIST):
    case FAILURE(ACTION_TYPES.FETCH_URETICIODEMELERI):
    case FAILURE(ACTION_TYPES.CREATE_URETICIODEMELERI):
    case FAILURE(ACTION_TYPES.UPDATE_URETICIODEMELERI):
    case FAILURE(ACTION_TYPES.DELETE_URETICIODEMELERI):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_URETICIODEMELERI_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_URETICIODEMELERI):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_URETICIODEMELERI):
    case SUCCESS(ACTION_TYPES.UPDATE_URETICIODEMELERI):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_URETICIODEMELERI):
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

const apiUrl = 'api/uretici-odemeleris';

// Actions

export const getEntities: ICrudGetAllAction<IUreticiOdemeleri> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_URETICIODEMELERI_LIST,
    payload: axios.get<IUreticiOdemeleri>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IUreticiOdemeleri> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_URETICIODEMELERI,
    payload: axios.get<IUreticiOdemeleri>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IUreticiOdemeleri> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_URETICIODEMELERI,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IUreticiOdemeleri> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_URETICIODEMELERI,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IUreticiOdemeleri> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_URETICIODEMELERI,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
