import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import UrunFiyat from './urun-fiyat';
import UrunFiyatDetail from './urun-fiyat-detail';
import UrunFiyatUpdate from './urun-fiyat-update';
import UrunFiyatDeleteDialog from './urun-fiyat-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={UrunFiyatDeleteDialog} />
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={UrunFiyatUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={UrunFiyatUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={UrunFiyatDetail} />
      <ErrorBoundaryRoute path={match.url} component={UrunFiyat} />
    </Switch>
  </>
);

export default Routes;
