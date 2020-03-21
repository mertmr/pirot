import React from 'react';
import {Switch} from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import OrtakFaturalar from './ortak-faturalar';
import OrtakFaturaDetail from "app/reports/ortak-faturalar/ortak-fatura-detail";

const Routes = ({match}) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={OrtakFaturaDetail}/>
      <ErrorBoundaryRoute path={match.url} component={OrtakFaturalar}/>
    </Switch>
  </>
);

export default Routes;
