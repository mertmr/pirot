import './home.scss';

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { Row, Col, Alert } from 'reactstrap';
import { getDashboardReports } from 'app/shared/reducers/dashboard-reports.reducer';

export interface IHomeProp extends StateProps, DispatchProps {}

export const Home = (props: IHomeProp) => {
  const { account, dashboardReports, isAuthenticated } = props;

  useEffect(() => {
    if(isAuthenticated) {
      props.getDashboardReports();
    }
  }, [account]);

  return (
    <Row>
      <Col md="9">
        <h2>
          <Translate contentKey="home.title">Welcome!</Translate>
        </h2>
        <p className="lead">
          <Translate contentKey="home.subtitle">This is your homepage</Translate>
        </p>
        {account && account.login && dashboardReports ? (
          <div>
            <Alert color="success">
              <Translate contentKey="home.logged.message" interpolate={{ username: account.login }}>
                You are logged in as user {account.login}.
              </Translate>
            </Alert>
            <Row gutter={18}>
              <Col span={6}>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Kasa</h5>
                  <p className="card-text"> {dashboardReports.kasadaNeVar ? dashboardReports.kasadaNeVar : 0} TL</p>
                </div>
              </div>
              </Col>
              <Col span={6}>
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Günlük Ciro</h5>
                    <p className="card-text">  {dashboardReports.gunlukCiro ? dashboardReports.gunlukCiro : 0} TL</p>
                  </div>
                </div>
              </Col>
              <Col span={6}>
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Kartlı Satış</h5>
                    <p className="card-text">  {dashboardReports.kartliSatis ? dashboardReports.kartliSatis : 0} TL</p>
                  </div>
                </div>
              </Col>
              <Col span={6}>
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Nakit Satış</h5>
                    <p className="card-text"> {dashboardReports.nakitSatis ? dashboardReports.nakitSatis : 0} TL</p>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        ) : (
          <div>
            <Alert color="warning">
              <Link to="/login" className="alert-link">
                <Translate contentKey="global.messages.info.authenticated.link"> sign in</Translate>
              </Link>
            </Alert>
          </div>
        )}
      </Col>
    </Row>
  );
};

const mapStateToProps = storeState => ({
  dashboardReports: storeState.dashboardReportsState.entity,
  account: storeState.authentication.account,
  isAuthenticated: storeState.authentication.isAuthenticated,
});

const mapDispatchToProps = {
  getDashboardReports,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Home);
