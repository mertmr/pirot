import React from 'react';
import { Switch } from 'react-router-dom';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';
import Ciro from './ciro';
import AylikSatislar from './aylik-satis';
import AylikSatislarMali from './aylik-satis-mali';
import OrtakFaturalar from './ortak-faturalar';
import Tukenme from './tukenme';
/* jhipster-needle-add-route-import - JHipster will add routes here */

const Routes = ({ match }) => (
  <div>
    <Switch>
      {/* prettier-ignore */}
      <ErrorBoundaryRoute path={`${match.url}/ciro`} component={Ciro}/>
      <ErrorBoundaryRoute path={`${match.url}/aylikSatislar`} component={AylikSatislar} />
      <ErrorBoundaryRoute path={`${match.url}/aylikSatislarMali`} component={AylikSatislarMali} />
      <ErrorBoundaryRoute path={`${match.url}/ortakFaturalar`} component={OrtakFaturalar} />
      <ErrorBoundaryRoute path={`${match.url}/tukenme`} component={Tukenme} />
    </Switch>
  </div>
);

export default Routes;
