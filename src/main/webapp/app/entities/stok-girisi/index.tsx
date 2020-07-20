import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import StokGirisi from './stok-girisi';
import StokGirisiDetail from './stok-girisi-detail';
import StokGirisiUpdate from './stok-girisi-update';
import StokGirisiDeleteDialog from './stok-girisi-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={StokGirisiUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={StokGirisiUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={StokGirisiDetail} />
      <ErrorBoundaryRoute path={match.url} component={StokGirisi} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={StokGirisiDeleteDialog} />
  </>
);

export default Routes;
