import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {Link, RouteComponentProps} from 'react-router-dom';
import {Button, Col, Label, Row} from 'reactstrap';
import {AvField, AvForm, AvGroup, AvInput} from 'availity-reactstrap-validation';
import {Translate} from 'react-jhipster';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {IRootState} from 'app/shared/reducers';

import {createEntity, getEntity, reset, updateEntity} from './nobet-hareketleri.reducer';
import {convertDateTimeFromServer, convertDateTimeToServer} from 'app/shared/util/date-utils';
import {InputNumber} from "antd";
import 'antd/lib/input-number/style/index.css';
import {getDashboardReports} from "app/shared/reducers/dashboard-reports.reducer";

export interface INobetHareketleriUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {
}

export const NobetHareketleriUpdate = (props: INobetHareketleriUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);
  const [kasa, setKasa] = useState(0);
  const [fark, setFark] = useState(0);
  const [money200, setMoney200] = useState(0);
  const [money100, setMoney100] = useState(0);
  const [money50, setMoney50] = useState(0);
  const [money20, setMoney20] = useState(0);
  const [money10, setMoney10] = useState(0);
  const [money5, setMoney5] = useState(0);
  const [money1, setMoney1] = useState(0);
  const [money05, setMoney05] = useState(0);
  const [money025, setMoney025] = useState(0);
  const [money01, setMoney01] = useState(0);
  const [money005, setMoney005] = useState(0);

  const {nobetHareketleriEntity, loading, updating, dashboardReports} = props;

  const handleClose = () => {
    props.history.push('/nobet-hareketleri' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    values.tarih = convertDateTimeToServer(values.tarih);

    if (errors.length === 0) {
      const entity = {
        ...nobetHareketleriEntity,
        ...values
      };

      if (isNew) {
        props.createEntity(entity);
      } else {
        props.updateEntity(entity);
      }
    }
  };

  const fixRounding = (value, precision) => {
    const power = Math.pow(10, precision || 0);
    return Math.round(value * power) / power;
  };

  useEffect(() => {
    setKasa(fixRounding(money200 * 200 + money100 * 100 + money50 * 50 + money20 * 20 + money10 * 10 + money5 * 5 + money1 +
      money05 * 0.5 + money025 * 0.25 + money01 * 0.1 + money005 * 0.05, 2));
  }, [money200, money100, money50, money20, money10, money5, money1, money05, money025, money01, money005]);

  useEffect(() => {
    setFark(kasa - dashboardReports.kasadaNeVar);
  }, [kasa]);

  useEffect(() => {
    props.getDashboardReports();
  }, []);

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="koopApp.nobetHareketleri.home.createOrEditLabel">
            <Translate contentKey="koopApp.nobetHareketleri.home.createOrEditLabel">Create or edit a
              NobetHareketleri</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : nobetHareketleriEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="nobet-hareketleri-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="nobet-hareketleri-id" type="text" className="form-control" name="id" required readOnly/>
                </AvGroup>
              ) : null}
              <AvGroup>
                <Row>
                  <Col>
                    <Label id="200moneyLabel" for="200moneyField" class="col-md-2 control-label">
                      200
                    </Label>
                    <InputNumber id="200moneyField" name="money200" value={money200}
                                 onChange={(value) => setMoney200(value)}/>
                  </Col>
                  <Col>
                    <Label id="100moneyLabel" for="100moneyField" class="col-md-2 control-label">
                      100
                    </Label>
                    <InputNumber id="100moneyField" name="money100" value={money100}
                                 onChange={(value) => setMoney100(value)}/>
                  </Col>
                  <Col>
                    <Label id="50moneyLabel" for="50moneyField" class="col-md-2 control-label">
                      50
                    </Label>
                    <InputNumber id="50moneyField" onChange={(value) => setMoney50(value)}/>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Label id="20moneyLabel" for="20moneyField" class="col-md-2 control-label">
                      20
                    </Label>
                    <InputNumber id="20moneyField" onChange={(value) => setMoney20(value)}/>
                  </Col>
                  <Col>
                    <Label id="10moneyLabel" for="10moneyField" class="col-md-2 control-label">
                      10
                    </Label>
                    <InputNumber id="10moneyField" onChange={(value) => setMoney10(value)}/>
                  </Col>
                  <Col>
                    <Label id="5moneyLabel" for="5moneyField" class="col-md-2 control-label">
                      5
                    </Label>
                    <InputNumber id="5moneyField" onChange={(value) => setMoney5(value)}/>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Label id="1moneyLabel" for="1moneyField" class="col-md-2 control-label">
                      1
                    </Label>
                    <InputNumber id="1moneyField" onChange={(value) => setMoney1(value)}/>
                  </Col>
                  <Col>
                    <Label id="05moneyLabel" for="05moneyField" class="col-md-2 control-label">
                      0.50
                    </Label>
                    <InputNumber id="05moneyField" onChange={(value) => setMoney05(value)}/>
                  </Col>
                  <Col>
                    <Label id="025moneyLabel" for="025moneyField" class="col-md-2 control-label">
                      0.25
                    </Label>
                    <InputNumber id="025moneyField" onChange={(value) => setMoney025(value)}/>
                  </Col>
                </Row>
                <Row>
                  <Col class="col-md-4">
                    <Label id="01moneyLabel" for="01moneyField" class="col-md-2 control-label">
                      0.1
                    </Label>
                    <InputNumber id="01moneyField" onChange={(value) => setMoney01(value)}/>
                  </Col>
                  <Col class="col-md-4">
                    <Label id="005moneyLabel" for="005moneyField" class="col-md-2 control-label">
                      0.05
                    </Label>
                    <InputNumber id="005moneyField" onChange={(value) => setMoney005(value)}/>
                  </Col>
                </Row>
              </AvGroup>
              <AvGroup>
                <Label id="kasaLabel" for="nobet-hareketleri-kasa">
                  <Translate contentKey="koopApp.nobetHareketleri.kasa">Kasa</Translate>
                </Label>
                <AvField id="nobet-hareketleri-kasa" type="text" name="kasa" disabled value={kasa}/>
              </AvGroup>
              <AvGroup>
                <Label id="pirotLabel" for="nobet-hareketleri-pirot">
                  <Translate contentKey="koopApp.nobetHareketleri.pirot">Pirot</Translate>
                </Label>
                <AvField id="nobet-hareketleri-pirot" type="text" disabled name="pirot"
                         value={dashboardReports.kasadaNeVar}/>
              </AvGroup>
              <AvGroup>
                <Label id="farkLabel" for="nobet-hareketleri-fark">
                  <Translate contentKey="koopApp.nobetHareketleri.fark">Fark</Translate>
                </Label>
                <AvField id="nobet-hareketleri-fark" type="text" disabled name="fark" value={fark}/>
              </AvGroup>
              <AvGroup>
                <Label id="notlarLabel" for="nobet-hareketleri-notlar">
                  <Translate contentKey="koopApp.nobetHareketleri.notlar">Notlar</Translate>
                </Label>
                <AvField id="nobet-hareketleri-notlar" type="text" name="notlar"/>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/nobet-hareketleri" replace color="info">
                <FontAwesomeIcon icon="arrow-left"/>
                &nbsp;
                <span className="d-none d-md-inline">
                  <Translate contentKey="entity.action.back">Back</Translate>
                </span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save"/>
                &nbsp;
                <Translate contentKey="entity.action.save">Save</Translate>
              </Button>
            </AvForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  dashboardReports: storeState.dashboardReportsState.entity,
  nobetHareketleriEntity: storeState.nobetHareketleri.entity,
  loading: storeState.nobetHareketleri.loading,
  updating: storeState.nobetHareketleri.updating,
  updateSuccess: storeState.nobetHareketleri.updateSuccess
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset,
  getDashboardReports
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(NobetHareketleriUpdate);
