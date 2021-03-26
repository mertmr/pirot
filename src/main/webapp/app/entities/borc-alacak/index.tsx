import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import BorcAlacak from './borc-alacak';
import BorcAlacakDetail from './borc-alacak-detail';
import BorcAlacakUpdate from './borc-alacak-update';
import BorcAlacakDeleteDialog from './borc-alacak-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={BorcAlacakUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={BorcAlacakUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={BorcAlacakDetail} />
      <ErrorBoundaryRoute path={match.url} component={BorcAlacak} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={BorcAlacakDeleteDialog} />
  </>
);

export default Routes;
