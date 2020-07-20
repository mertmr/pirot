import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Kisiler from './kisiler';
import KisilerDetail from './kisiler-detail';
import KisilerUpdate from './kisiler-update';
import KisilerDeleteDialog from './kisiler-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={KisilerUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={KisilerUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={KisilerDetail} />
      <ErrorBoundaryRoute path={match.url} component={Kisiler} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={KisilerDeleteDialog} />
  </>
);

export default Routes;
