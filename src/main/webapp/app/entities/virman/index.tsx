import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Virman from './virman';
import VirmanDetail from './virman-detail';
import VirmanUpdate from './virman-update';
import VirmanDeleteDialog from './virman-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={VirmanUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={VirmanUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={VirmanDetail} />
      <ErrorBoundaryRoute path={match.url} component={Virman} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={VirmanDeleteDialog} />
  </>
);

export default Routes;
