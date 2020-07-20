import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Uretici from './uretici';
import UreticiDetail from './uretici-detail';
import UreticiUpdate from './uretici-update';
import UreticiDeleteDialog from './uretici-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={UreticiUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={UreticiUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={UreticiDetail} />
      <ErrorBoundaryRoute path={match.url} component={Uretici} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={UreticiDeleteDialog} />
  </>
);

export default Routes;
