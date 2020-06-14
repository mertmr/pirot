import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import KasaHareketleri from './kasa-hareketleri';
import KasaHareketleriDetail from './kasa-hareketleri-detail';
import KasaHareketleriUpdate from './kasa-hareketleri-update';
import KasaHareketleriDeleteDialog from './kasa-hareketleri-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={KasaHareketleriDeleteDialog} />
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={KasaHareketleriUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={KasaHareketleriUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={KasaHareketleriDetail} />
      <ErrorBoundaryRoute path={match.url} component={KasaHareketleri} />
    </Switch>
  </>
);

export default Routes;
