import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import SatisStokHareketleri from './satis-stok-hareketleri';
import SatisStokHareketleriDetail from './satis-stok-hareketleri-detail';
import SatisStokHareketleriUpdate from './satis-stok-hareketleri-update';
import SatisStokHareketleriDeleteDialog from './satis-stok-hareketleri-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={SatisStokHareketleriUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={SatisStokHareketleriUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={SatisStokHareketleriDetail} />
      <ErrorBoundaryRoute path={match.url} component={SatisStokHareketleri} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={SatisStokHareketleriDeleteDialog} />
  </>
);

export default Routes;
