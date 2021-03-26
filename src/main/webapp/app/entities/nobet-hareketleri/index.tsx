import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import NobetHareketleri from './nobet-hareketleri';
import NobetHareketleriDetail from './nobet-hareketleri-detail';
import NobetHareketleriUpdate from './nobet-hareketleri-update';
import NobetHareketleriDeleteDialog from './nobet-hareketleri-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={NobetHareketleriUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={NobetHareketleriUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={NobetHareketleriDetail} />
      <ErrorBoundaryRoute path={match.url} component={NobetHareketleri} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={NobetHareketleriDeleteDialog} />
  </>
);

export default Routes;
