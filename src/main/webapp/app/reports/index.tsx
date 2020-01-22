import React from 'react';
import {Switch} from 'react-router-dom';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';
import Ciro from './ciro';
import AylikSatislar from './aylik-satis';
/* jhipster-needle-add-route-import - JHipster will add routes here */

const Routes = ({match}) => (
  <div>
    <Switch>
      {/* prettier-ignore */}
      <ErrorBoundaryRoute path={`${match.url}/ciro`} component={Ciro}/>
      <ErrorBoundaryRoute path={`${match.url}/aylikSatislar`} component={AylikSatislar}/>
    </Switch>
  </div>
);

export default Routes;
