import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { INobetHareketleri, defaultValue } from 'app/shared/model/nobet-hareketleri.model';
import { defaultValueGunSonuRaporu, IGunSonuRaporu } from 'app/shared/model/gun-sonu-raporu-model';

export const ACTION_TYPES = {
  FETCH_NOBETHAREKETLERI_LIST: 'nobetHareketleri/FETCH_NOBETHAREKETLERI_LIST',
  FETCH_NOBETHAREKETLERI: 'nobetHareketleri/FETCH_NOBETHAREKETLERI',
  FETCH_GUN_SONU: 'nobetHareketleri/FETCH_GUN_SONU',
  CREATE_NOBETHAREKETLERI: 'nobetHareketleri/CREATE_NOBETHAREKETLERI',
  UPDATE_NOBETHAREKETLERI: 'nobetHareketleri/UPDATE_NOBETHAREKETLERI',
  DELETE_NOBETHAREKETLERI: 'nobetHareketleri/DELETE_NOBETHAREKETLERI',
  RESET: 'nobetHareketleri/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<INobetHareketleri>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
  gunSonuRaporu: defaultValueGunSonuRaporu,
};

export type NobetHareketleriState = Readonly<typeof initialState>;

// Reducer

export default (state: NobetHareketleriState = initialState, action): NobetHareketleriState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_NOBETHAREKETLERI_LIST):
    case REQUEST(ACTION_TYPES.FETCH_GUN_SONU):
    case REQUEST(ACTION_TYPES.FETCH_NOBETHAREKETLERI):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_NOBETHAREKETLERI):
    case REQUEST(ACTION_TYPES.UPDATE_NOBETHAREKETLERI):
    case REQUEST(ACTION_TYPES.DELETE_NOBETHAREKETLERI):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_NOBETHAREKETLERI_LIST):
    case FAILURE(ACTION_TYPES.FETCH_GUN_SONU):
    case FAILURE(ACTION_TYPES.FETCH_NOBETHAREKETLERI):
    case FAILURE(ACTION_TYPES.CREATE_NOBETHAREKETLERI):
    case FAILURE(ACTION_TYPES.UPDATE_NOBETHAREKETLERI):
    case FAILURE(ACTION_TYPES.DELETE_NOBETHAREKETLERI):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_NOBETHAREKETLERI_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_NOBETHAREKETLERI):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.FETCH_GUN_SONU):
      return {
        ...state,
        loading: false,
        gunSonuRaporu: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_NOBETHAREKETLERI):
    case SUCCESS(ACTION_TYPES.UPDATE_NOBETHAREKETLERI):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_NOBETHAREKETLERI):
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

const apiUrl = 'api/nobet-hareketleris';

// Actions

export const getEntities: ICrudGetAllAction<INobetHareketleri> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_NOBETHAREKETLERI_LIST,
    payload: axios.get<INobetHareketleri>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<INobetHareketleri> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_NOBETHAREKETLERI,
    payload: axios.get<INobetHareketleri>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<INobetHareketleri> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_NOBETHAREKETLERI,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<INobetHareketleri> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_NOBETHAREKETLERI,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<INobetHareketleri> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_NOBETHAREKETLERI,
    payload: axios.delete(requestUrl),
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});

export const getGunSonuRaporu = fromDate => {
  let requestUrl = `api/reports/gun-sonu-raporu`;
  requestUrl += `?reportDate=${fromDate}`;
  return {
    type: ACTION_TYPES.FETCH_GUN_SONU,
    payload: axios.get<IGunSonuRaporu>(requestUrl),
  };
};
