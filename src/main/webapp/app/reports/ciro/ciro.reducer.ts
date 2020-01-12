import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ICiro, defaultValue } from 'app/shared/model/ciro.model';

export const ACTION_TYPES = {
  FETCH_CIRO_LIST: 'ciro/FETCH_CIRO_LIST',
  RESET: 'ciro/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ICiro>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false
};

export type CiroState = Readonly<typeof initialState>;

// Reducer

export default (state: CiroState = initialState, action): CiroState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_CIRO_LIST):
    case FAILURE(ACTION_TYPES.FETCH_CIRO_LIST):
    case SUCCESS(ACTION_TYPES.FETCH_CIRO_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10)
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

const apiUrl = 'api/reports';

// Actions

export const getEntities: ICrudGetAllAction<ICiro> = (page, size, sort) => {
  const requestUrl = `${apiUrl}/ciro${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_CIRO_LIST,
    payload: axios.get<ICiro>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
