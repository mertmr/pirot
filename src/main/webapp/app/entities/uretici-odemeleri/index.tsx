import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import UreticiOdemeleri from './uretici-odemeleri';
import UreticiOdemeleriDetail from './uretici-odemeleri-detail';
import UreticiOdemeleriUpdate from './uretici-odemeleri-update';
import UreticiOdemeleriDeleteDialog from './uretici-odemeleri-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={UreticiOdemeleriUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={UreticiOdemeleriUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={UreticiOdemeleriDetail} />
      <ErrorBoundaryRoute path={match.url} component={UreticiOdemeleri} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={UreticiOdemeleriDeleteDialog} />
  </>
);

export default Routes;
