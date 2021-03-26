import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Gider from './gider';
import GiderDetail from './gider-detail';
import GiderUpdate from './gider-update';
import GiderDeleteDialog from './gider-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={GiderUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={GiderUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={GiderDetail} />
      <ErrorBoundaryRoute path={match.url} component={Gider} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={GiderDeleteDialog} />
  </>
);

export default Routes;
