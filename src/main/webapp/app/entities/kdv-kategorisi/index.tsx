import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import KdvKategorisi from './kdv-kategorisi';
import KdvKategorisiDetail from './kdv-kategorisi-detail';
import KdvKategorisiUpdate from './kdv-kategorisi-update';
import KdvKategorisiDeleteDialog from './kdv-kategorisi-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={KdvKategorisiUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={KdvKategorisiUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={KdvKategorisiDetail} />
      <ErrorBoundaryRoute path={match.url} component={KdvKategorisi} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={KdvKategorisiDeleteDialog} />
  </>
);

export default Routes;
