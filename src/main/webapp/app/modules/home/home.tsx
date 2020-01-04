import './home.scss';

import React from 'react';
import {Link} from 'react-router-dom';
import {Translate} from 'react-jhipster';
import {connect} from 'react-redux';
import {Row, Col, Alert} from 'reactstrap';
import 'antd/lib/statistic/style/index.css';
import 'antd/lib/card/style/index.css';
import {Card, Statistic} from 'antd';

import {IRootState} from 'app/shared/reducers';

export type IHomeProp = StateProps;

export const Home = (props: IHomeProp) => {
  const {account} = props;

  return (
    <Row>
      <Col md="9">
        <h2>
          <Translate contentKey="home.title">Welcome!</Translate>
        </h2>
        <p className="lead">
          <Translate contentKey="home.subtitle">This is your homepage</Translate>
        </p>
        {account && account.login ? (
          <div>
            <Alert color="success">
              <Translate contentKey="home.logged.message" interpolate={{username: account.login}}>
                You are logged in as user {account.login}.
              </Translate>
            </Alert>
            <Row gutter={18}>
              <Col span={6}>
                <Card>
                  <Statistic title="Kasa" value={112893.34} suffix="TL"/>
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic title="Günlük Ciro" value={112893.34} suffix="TL"/>
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
  account: storeState.authentication.account,
  isAuthenticated: storeState.authentication.isAuthenticated
});

type StateProps = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(Home);
