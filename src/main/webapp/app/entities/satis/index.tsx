import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Satis from './satis';
import SatisDetail from './satis-detail';
import SatisUpdate from './satis-update';
import SatisDeleteDialog from './satis-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={SatisUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={SatisUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={SatisDetail} />
      <ErrorBoundaryRoute path={match.url} component={Satis} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={SatisDeleteDialog} />
  </>
);

export default Routes;
