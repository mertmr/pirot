import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Ciro from './ciro';
import CiroDetail from "app/reports/ciro/ciro-detail";

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={CiroDetail}/>
      <ErrorBoundaryRoute path={match.url} component={Ciro} />
    </Switch>
  </>
);

export default Routes;
