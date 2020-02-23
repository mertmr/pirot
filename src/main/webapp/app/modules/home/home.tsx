import './home.scss';

import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {Translate} from 'react-jhipster';
import {connect} from 'react-redux';
import {Row, Col, Alert} from 'reactstrap';
import 'antd/lib/statistic/style/index.css';
import 'antd/lib/card/style/index.css';
import {Card, Statistic} from 'antd';
import {getDashboardReports} from 'app/shared/reducers/dashboard-reports.reducer';

import {IRootState} from 'app/shared/reducers';

export interface IHomeProp extends StateProps, DispatchProps {
}

export const Home = (props: IHomeProp) => {
  const {account, dashboardReports} = props;

  useEffect(() => {
    props.getDashboardReports();
  }, []);

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
              <Translate contentKey="home.logged.message" interpolate={{username: account.login}}>
                You are logged in as user {account.login}.
              </Translate>
            </Alert>
            <Row gutter={18}>
              <Col span={6}>
                <Card>
                  <Statistic title="Kasa" value={dashboardReports.kasadaNeVar ? dashboardReports.kasadaNeVar : 0} suffix="TL"/>
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic title="Günlük Ciro" value={dashboardReports.gunlukCiro ? dashboardReports.gunlukCiro : 0} suffix="TL"/>
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic title="Kartlı Satış" value={dashboardReports.kartliSatis ? dashboardReports.kartliSatis : 0} suffix="TL"/>
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic title="Nakit Satış" value={dashboardReports.nakitSatis ? dashboardReports.nakitSatis : 0} suffix="TL"/>
                </Card>
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

            <Alert color="warning">
              <Translate contentKey="global.messages.info.register.noaccount">You do not have an account
                yet?</Translate>&nbsp;
              <Link to="/account/register" className="alert-link">
                <Translate contentKey="global.messages.info.register.link">Register a new account</Translate>
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
  isAuthenticated: storeState.authentication.isAuthenticated
});

const mapDispatchToProps = {
  getDashboardReports
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps,mapDispatchToProps)(Home);
