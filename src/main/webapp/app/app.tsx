import 'react-toastify/dist/ReactToastify.css';
import './app.scss';

import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Card } from 'reactstrap';
import { BrowserRouter as Router } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { hot } from 'react-hot-loader';

import { IRootState } from 'app/shared/reducers';
import { getSession } from 'app/shared/reducers/authentication';
import { getProfile } from 'app/shared/reducers/application-profile';
import { setLocale } from 'app/shared/reducers/locale';
import Header from 'app/shared/layout/header/header';
import Sidebar from 'app/shared/layout/sidebar/sidebar';
import Footer from 'app/shared/layout/footer/footer';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import ErrorBoundary from 'app/shared/error/error-boundary';
import { AUTHORITIES } from 'app/config/constants';
import AppRoutes from 'app/routes';
import { EntitiesMenu } from 'app/shared/layout/menus';

const baseHref = document.querySelector('base').getAttribute('href').replace(/\/$/, '');

export interface IAppProps extends StateProps, DispatchProps {}

export const App = (props: IAppProps) => {
  const [menuOpen, setMenuOpen] = useState(true);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    props.getSession();
    props.getProfile();
  }, []);

  const paddingTop = '60px';
  return (
    <Router basename={baseHref}>
      <div className="d-flex wrapperx">
        <Sidebar
          onClick={toggleMenu}
          isAuthenticated={props.isAuthenticated}
          isAdmin={props.isAdmin}
          menuOpen={menuOpen}
          currentLocale={props.currentLocale}
          onLocaleChange={props.setLocale}
          ribbonEnv={props.ribbonEnv}
          isInProduction={props.isInProduction}
          isSwaggerEnabled={props.isSwaggerEnabled}
        />
        <div className="app-container">
          <ToastContainer position={toast.POSITION.TOP_LEFT} className="toastify-container" toastClassName="toastify-toast" />
          <ErrorBoundary>
            <Header
              onClick={toggleMenu}
              isAuthenticated={props.isAuthenticated}
              isAdmin={props.isAdmin}
              currentLocale={props.currentLocale}
              onLocaleChange={props.setLocale}
              ribbonEnv={props.ribbonEnv}
              isInProduction={props.isInProduction}
              isSwaggerEnabled={props.isSwaggerEnabled}
            />
          </ErrorBoundary>
          <div className="container-fluid view-container" id="app-view-container">
            <Card className="jh-card">
              <ErrorBoundary>
                <AppRoutes />
              </ErrorBoundary>
            </Card>
            <Footer />
          </div>
        </div>
      </div>
    </Router>
  );
};

const mapStateToProps = ({ authentication, applicationProfile, locale }: IRootState) => ({
  currentLocale: locale.currentLocale,
  isAuthenticated: authentication.isAuthenticated,
  isAdmin: hasAnyAuthority(authentication.account.authorities, [AUTHORITIES.ADMIN]),
  ribbonEnv: applicationProfile.ribbonEnv,
  isInProduction: applicationProfile.inProduction,
  isSwaggerEnabled: applicationProfile.isSwaggerEnabled,
});

const mapDispatchToProps = { setLocale, getSession, getProfile };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(hot(module)(App));
