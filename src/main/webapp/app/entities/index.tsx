import React from 'react';
import { Switch } from 'react-router-dom';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Gider from './gider';
import KdvKategorisi from './kdv-kategorisi';
import Satis from './satis';
import SatisStokHareketleri from './satis-stok-hareketleri';
import StokGirisi from './stok-girisi';
import Uretici from './uretici';
import Urun from './urun';
import UrunFiyat from './urun-fiyat';
import Virman from './virman';
import BorcAlacak from './borc-alacak';
import KasaHareketleri from './kasa-hareketleri';
import NobetHareketleri from './nobet-hareketleri';
import Kisiler from './kisiler';
import UrunFiyatHesap from './urun-fiyat-hesap';
/* jhipster-needle-add-route-import - JHipster will add routes here */

const Routes = ({ match }) => (
  <div>
    <Switch>
      {/* prettier-ignore */}
      <ErrorBoundaryRoute path={`${match.url}gider`} component={Gider} />
      <ErrorBoundaryRoute path={`${match.url}kdv-kategorisi`} component={KdvKategorisi} />
      <ErrorBoundaryRoute path={`${match.url}satis`} component={Satis} />
      <ErrorBoundaryRoute path={`${match.url}satis-stok-hareketleri`} component={SatisStokHareketleri} />
      <ErrorBoundaryRoute path={`${match.url}stok-girisi`} component={StokGirisi} />
      <ErrorBoundaryRoute path={`${match.url}uretici`} component={Uretici} />
      <ErrorBoundaryRoute path={`${match.url}urun`} component={Urun} />
      <ErrorBoundaryRoute path={`${match.url}urun-fiyat`} component={UrunFiyat} />
      <ErrorBoundaryRoute path={`${match.url}virman`} component={Virman} />
      <ErrorBoundaryRoute path={`${match.url}borc-alacak`} component={BorcAlacak} />
      <ErrorBoundaryRoute path={`${match.url}kasa-hareketleri`} component={KasaHareketleri} />
      <ErrorBoundaryRoute path={`${match.url}nobet-hareketleri`} component={NobetHareketleri} />
      <ErrorBoundaryRoute path={`${match.url}kisiler`} component={Kisiler} />
      <ErrorBoundaryRoute path={`${match.url}urun-fiyat-hesap`} component={UrunFiyatHesap} />
      {/* jhipster-needle-add-route-path - JHipster will add routes here */}
    </Switch>
  </div>
);

export default Routes;
