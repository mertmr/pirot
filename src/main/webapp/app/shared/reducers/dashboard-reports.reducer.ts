import axios from 'axios';
import { ICrudGetAction } from 'react-jhipster';
import { FAILURE, REQUEST, SUCCESS } from 'app/shared/reducers/action-type.util';

import { defaultValue, IDashboardReports } from 'app/shared/model/dashboard-reports.model';

export const ACTION_TYPES = {
  FETCH_REPORTS: 'dashboardReports/FETCH_REPORTS',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entity: defaultValue,
  updateSuccess: false,
};

export type DashboardReportsState = Readonly<typeof initialState>;

// Reducer

export default (state: DashboardReportsState = initialState, action): DashboardReportsState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_REPORTS):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_REPORTS):
    case SUCCESS(ACTION_TYPES.FETCH_REPORTS):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    default:
      return state;
  }
};

const apiUrl = 'api/dashboard-reports';

// Actions

export const getDashboardReports = () => {
  const requestUrl = `${apiUrl}`;
  return {
    type: ACTION_TYPES.FETCH_REPORTS,
    payload: axios.get<IDashboardReports>(requestUrl),
  };
};
