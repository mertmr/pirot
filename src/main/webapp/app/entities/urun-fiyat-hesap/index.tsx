import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import UrunFiyatHesap from './urun-fiyat-hesap';
import UrunFiyatHesapDetail from './urun-fiyat-hesap-detail';
import UrunFiyatHesapUpdate from './urun-fiyat-hesap-update';
import UrunFiyatHesapDeleteDialog from './urun-fiyat-hesap-delete-dialog';
import FiyatHesap from './fiyat-hesapla';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={UrunFiyatHesapUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={UrunFiyatHesapUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={UrunFiyatHesapDetail} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/hesap`} component={FiyatHesap} />
      <ErrorBoundaryRoute path={match.url} component={UrunFiyatHesap} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={UrunFiyatHesapDeleteDialog} />
  </>
);

export default Routes;
