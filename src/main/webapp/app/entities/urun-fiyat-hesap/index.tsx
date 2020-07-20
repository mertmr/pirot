import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import UrunFiyatHesap from './urun-fiyat-hesap';
import UrunFiyatHesapDetail from './urun-fiyat-hesap-detail';
import UrunFiyatHesapUpdate from './urun-fiyat-hesap-update';
import UrunFiyatHesapDeleteDialog from './urun-fiyat-hesap-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={UrunFiyatHesapDeleteDialog} />
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={UrunFiyatHesapUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={UrunFiyatHesapUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={UrunFiyatHesapDetail} />
      <ErrorBoundaryRoute path={match.url} component={UrunFiyatHesap} />
    </Switch>
  </>
);

export default Routes;
