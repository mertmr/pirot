import React from 'react';
import {Switch} from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Tukenme from './tukenme';

const Routes = ({match}) => (
  <>
    <Switch>
      <ErrorBoundaryRoute path={match.url} component={Tukenme}/>
    </Switch>
  </>
);

export default Routes;
