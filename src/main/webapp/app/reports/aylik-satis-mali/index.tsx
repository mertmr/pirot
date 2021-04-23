import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import AylikSatislarMali from './aylik-satislar-mali';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute path={match.url} component={AylikSatislarMali} />
    </Switch>
  </>
);

export default Routes;
