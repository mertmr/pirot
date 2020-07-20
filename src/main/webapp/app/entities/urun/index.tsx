import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Urun from './urun';
import UrunDetail from './urun-detail';
import UrunUpdate from './urun-update';
import UrunDeleteDialog from './urun-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={UrunDeleteDialog} />
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={UrunUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={UrunUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={UrunDetail} />
      <ErrorBoundaryRoute path={match.url} component={Urun} />
    </Switch>
  </>
);

export default Routes;
