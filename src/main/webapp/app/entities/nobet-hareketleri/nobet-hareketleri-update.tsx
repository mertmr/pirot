import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Label, Row } from 'reactstrap';
import { AvField, AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';
import { translate, Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { createEntity, getEntity, reset, updateEntity } from './nobet-hareketleri.reducer';
import { convertDateTimeToServer } from 'app/shared/util/date-utils';
import { getDashboardReports } from 'app/shared/reducers/dashboard-reports.reducer';
import { getUsers } from 'app/modules/administration/user-management/user-management.reducer';

export interface INobetHareketleriUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const NobetHareketleriUpdate = (props: INobetHareketleriUpdateProps) => {
  const [userId, setUserId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);
  const [kasa, setKasa] = useState(0);
  const [fark, setFark] = useState(0);
  const [farkDenge, setFarkDenge] = useState(0);
  const [money200, setMoney200] = useState(0);
  const [money100,  setMoney100] = useState(0);
  const [money50, setMoney50] = useState(0);
  const [money20, setMoney20] = useState(0);
  const [money10, setMoney10] = useState(0);
  const [money5, setMoney5] = useState(0);
  const [money1, setMoney1] = useState(0);
  const [money05, setMoney05] = useState(0);
  const [money025, setMoney025] = useState(0);
  const [money01, setMoney01] = useState(0);
  const [money005, setMoney005] = useState(0);

  const { nobetHareketleriEntity, users, loading, updating, dashboardReports } = props;

  const handleClose = () => {
    props.history.push('/nobet-hareketleri' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getUsers();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    if (isNew) {
      values.tarih = convertDateTimeToServer(values.tarih);
    }

    if (errors.length === 0) {
      const entity = {
        ...nobetHareketleriEntity,
        ...values,
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
    setKasa(
      fixRounding(
        money200 * 200 +
          money100 * 100 +
          money50 * 50 +
          money20 * 20 +
          money10 * 10 +
          money5 * 5 +
          money1 * 1 +
          money05 * 0.5 +
          money025 * 0.25 +
          money01 * 0.1 +
          money005 * 0.05,
        2
      )
    );
  }, [money200, money100, money50, money20, money10, money5, money1, money05, money025, money01, money005]);

  useEffect(() => {
    setFark(fixRounding(kasa - dashboardReports.kasadaNeVar, 2));
  }, [kasa]);

  useEffect(() => {
    setKasa(props.nobetHareketleriEntity.kasa);
  }, [props.nobetHareketleriEntity.kasa]);

  useEffect(() => {
    setFarkDenge(props.nobetHareketleriEntity.farkDenge);
  }, [props.nobetHareketleriEntity.farkDenge]);

  useEffect(() => {
    setFark(fixRounding(kasa - dashboardReports.kasadaNeVar, 2) + Number(farkDenge));
  }, [farkDenge]);

  useEffect(() => {
    props.getDashboardReports();
  }, []);

  const updateStokGirisi = value => {
    props.getDashboardReports();
  };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="koopApp.nobetHareketleri.home.createOrEditLabel">
            <Translate contentKey="koopApp.nobetHareketleri.home.createOrEditLabel">Create or edit a NobetHareketleri</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8"  style={{ marginTop: '10px' }}>
          <h5>Banknot Sayıları</h5>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : nobetHareketleriEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="nobet-hareketleri-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="nobet-hareketleri-id" type="number" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Col>
                  <Row>
                    <label htmlFor="200moneyField" className="col-sm-2 col-form-label">
                      200
                    </label>
                    <input
                      id="200moneyField"
                      className="col-sm-2"
                      name="money200"
                      value={money200}
                      onChange={e => setMoney200(Number(e.target.value))}
                    />
                    <label htmlFor="100moneyField" className="col-sm-2 col-form-label">
                      100
                    </label>
                    <input
                      id="100moneyField"
                      className="col-sm-2"
                      name="money100"
                      value={money100}
                      onChange={e => setMoney100(Number(e.target.value))}
                    />
                    <label htmlFor="50moneyField" className="col-sm-2 col-form-label">
                      50
                    </label>
                    <input
                      id="50moneyField"
                      className="col-sm-2"
                      name="money50"
                      value={money50}
                      onChange={e => setMoney50(Number(e.target.value))}
                    />
                    <label htmlFor="20moneyField" className="col-sm-2 col-form-label">
                      20
                    </label>
                    <input
                      id="20moneyField"
                      className="col-sm-2"
                      name="money20"
                      value={money20}
                      onChange={e => setMoney20(Number(e.target.value))}
                    />
                    <label htmlFor="10moneyField" className="col-sm-2 col-form-label">
                      10
                    </label>
                    <input
                      id="10moneyField"
                      className="col-sm-2"
                      type="number"
                      name="money10"
                      value={money10}
                      onChange={e => setMoney10(Number(e.target.value))}
                    />
                    <label htmlFor="5moneyField" className="col-sm-2 col-form-label">
                      5
                    </label>
                    <input
                      id="5moneyField"
                      className="col-sm-2"
                      name="money5"
                      value={money5}
                      onChange={e => setMoney5(Number(e.target.value))}
                    />
                    <label htmlFor="1moneyField" className="col-sm-2 col-form-label">
                      1
                    </label>
                    <input
                      id="1moneyField"
                      className="col-sm-2"
                      value={money1}
                      onChange={e => setMoney1(Number(e.target.value))}
                    />
                    <label htmlFor="05moneyField" className="col-sm-2 col-form-label">
                      0.50
                    </label>
                    <input
                      id="05moneyField"
                      className="col-sm-2"
                      name="money05"
                      value={money05}
                      onChange={e => setMoney05(Number(Number(e.target.value)))}
                    />
                    <label htmlFor="025moneyField" className="col-sm-2 col-form-label">
                      0.25
                    </label>
                    <input
                      id="025moneyField"
                      className="col-sm-2"
                      name="money025"
                      value={money025}
                      onChange={e => setMoney025(Number(e.target.value))}
                    />
                    <label htmlFor="01moneyField" className="col-sm-2 col-form-label">
                      0.10
                    </label>
                    <input
                      id="01moneyField"
                      className="col-sm-2"
                      name="money01"
                      value={money01}
                      onChange={e => setMoney01(Number(e.target.value))}
                    />
                    <label htmlFor="005moneyField" className="col-sm-2 col-form-label">
                      0.05
                    </label>
                    <input
                      id="005moneyField"
                      className="col-sm-2"
                      name="money005"
                      value={money005}
                      onChange={e => setMoney005(Number(e.target.value))}
                    />
                  </Row>
                </Col>
              </AvGroup>
              <AvGroup>
                <Label id="kasaLabel" for="nobet-hareketleri-kasa">
                  <Translate contentKey="koopApp.nobetHareketleri.kasa">Kasa</Translate>
                </Label>
                <AvField id="nobet-hareketleri-kasa" type="number" name="kasa" on value={kasa} onChange={e => setKasa(e.target.value)} />
              </AvGroup>
              <AvGroup>
                <Label id="pirotLabel" for="nobet-hareketleri-pirot">
                  <Translate contentKey="koopApp.nobetHareketleri.pirot">Pirot</Translate>
                </Label>
                <AvField id="nobet-hareketleri-pirot" type="number" name="pirot" value={dashboardReports.kasadaNeVar} />
              </AvGroup>
              <AvGroup>
                <Label id="farkLabel" for="nobet-hareketleri-fark">
                  <Translate contentKey="koopApp.nobetHareketleri.fark">Fark</Translate>
                </Label>
                <AvField id="nobet-hareketleri-fark" type="number" name="fark" disabled value={fark} />
              </AvGroup>
              <AvGroup>
                <Label id="farkDengeLabel" for="nobet-hareketleri-farkDenge">
                  <Translate contentKey="koopApp.nobetHareketleri.farkDenge">Fark Denge</Translate>
                </Label>
                <AvField id="nobet-hareketleri-farkDenge" type="number" name="farkDenge" on value={farkDenge}  onChange={e => setFarkDenge(e.target.value)} />
              </AvGroup>
              <AvGroup>
                <Label id="nobetSuresiLabel" for="nobet-hareketleri-nobetSuresi">
                  <Translate contentKey="koopApp.nobetHareketleri.nobetSuresi">Nobet Suresi</Translate>
                </Label>
                <AvField id="nobet-hareketleri-nobetSuresi" type="number" name="nobetSuresi" />
              </AvGroup>
              <AvGroup>
                <Label id="acilisKapanis" for="nobet-hareketleri-acilisKapanis">
                  <Translate contentKey="koopApp.nobetHareketleri.acilisKapanis">Açılış/Kapanış</Translate>
                </Label>
                <AvInput
                  id="nobet-hareketleri-acilisKapanis"
                  type="select"
                  className="form-control"
                  name="acilisKapanis"
                  value={(!isNew && nobetHareketleriEntity.acilisKapanis) || 'ACILIS'}
                >
                  <option value="ACILIS">{translate('koopApp.AcilisKapanis.ACILIS')}</option>
                  <option value="KAPANIS">{translate('koopApp.AcilisKapanis.KAPANIS')}</option>
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label id="notlarLabel" for="nobet-hareketleri-notlar">
                  <Translate contentKey="koopApp.nobetHareketleri.notlar">Notlar</Translate>
                </Label>
                <AvField id="nobet-hareketleri-notlar" type="text" name="notlar" />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/nobet-hareketleri" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">
                  <Translate contentKey="entity.action.back">Back</Translate>
                </span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
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
  users: storeState.userManagement.users,
  nobetHareketleriEntity: storeState.nobetHareketleri.entity,
  loading: storeState.nobetHareketleri.loading,
  updating: storeState.nobetHareketleri.updating,
  updateSuccess: storeState.nobetHareketleri.updateSuccess,
});

const mapDispatchToProps = {
  getUsers,
  getEntity,
  updateEntity,
  createEntity,
  reset,
  getDashboardReports,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(NobetHareketleriUpdate);
