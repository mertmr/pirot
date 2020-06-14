import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IUser } from 'app/shared/model/user.model';
import { getUsers } from 'app/modules/administration/user-management/user-management.reducer';
import { IKdvKategorisi } from 'app/shared/model/kdv-kategorisi.model';
import { getEntities as getKdvKategorisis } from 'app/entities/kdv-kategorisi/kdv-kategorisi.reducer';
import { IUrunFiyatHesap } from 'app/shared/model/urun-fiyat-hesap.model';
import { getEntities as getUrunFiyatHesaps } from 'app/entities/urun-fiyat-hesap/urun-fiyat-hesap.reducer';
import { getEntity, updateEntity, createEntity, reset } from './urun.reducer';
import { IUrun } from 'app/shared/model/urun.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IUrunUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const UrunUpdate = (props: IUrunUpdateProps) => {
  const [urunSorumlusuId, setUrunSorumlusuId] = useState('0');
  const [kdvKategorisiId, setKdvKategorisiId] = useState('0');
  const [urunFiyatHesapId, setUrunFiyatHesapId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { urunEntity, users, kdvKategorisis, urunFiyatHesaps, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/urun' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getUsers();
    props.getKdvKategorisis();
    props.getUrunFiyatHesaps();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...urunEntity,
        ...values
      };
      entity.user = users[values.user];

      if (isNew) {
        props.createEntity(entity);
      } else {
        props.updateEntity(entity);
      }
    }
  };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="koopApp.urun.home.createOrEditLabel">
            <Translate contentKey="koopApp.urun.home.createOrEditLabel">Create or edit a Urun</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : urunEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="urun-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="urun-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="urunAdiLabel" for="urun-urunAdi">
                  <Translate contentKey="koopApp.urun.urunAdi">Urun Adi</Translate>
                </Label>
                <AvField
                  id="urun-urunAdi"
                  type="text"
                  name="urunAdi"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="stokLabel" for="urun-stok">
                  <Translate contentKey="koopApp.urun.stok">Stok</Translate>
                </Label>
                <AvField id="urun-stok" type="text" name="stok" />
              </AvGroup>
              <AvGroup>
                <Label id="stokSiniriLabel" for="urun-stokSiniri">
                  <Translate contentKey="koopApp.urun.stokSiniri">Stok Siniri</Translate>
                </Label>
                <AvField id="urun-stokSiniri" type="text" name="stokSiniri" />
              </AvGroup>
              <AvGroup>
                <Label id="musteriFiyatiLabel" for="urun-musteriFiyati">
                  <Translate contentKey="koopApp.urun.musteriFiyati">Musteri Fiyati</Translate>
                </Label>
                <AvField id="urun-musteriFiyati" type="text" name="musteriFiyati" />
              </AvGroup>
              <AvGroup>
                <Label id="birimLabel" for="urun-birim">
                  <Translate contentKey="koopApp.urun.birim">Birim</Translate>
                </Label>
                <AvInput id="urun-birim" type="select" className="form-control" name="birim" value={(!isNew && urunEntity.birim) || 'ADET'}>
                  <option value="ADET">{translate('koopApp.Birim.ADET')}</option>
                  <option value="GRAM">{translate('koopApp.Birim.GRAM')}</option>
                </AvInput>
              </AvGroup>
              <AvGroup check>
                <Label id="dayanismaUrunuLabel">
                  <AvInput id="urun-dayanismaUrunu" type="checkbox" className="form-check-input" name="dayanismaUrunu" />
                  <Translate contentKey="koopApp.urun.dayanismaUrunu">Dayanisma Urunu</Translate>
                </Label>
              </AvGroup>
              <AvGroup check>
                <Label id="satistaLabel">
                  <AvInput id="urun-satista" type="checkbox" className="form-check-input" name="satista" />
                  <Translate contentKey="koopApp.urun.satista">Satista</Translate>
                </Label>
              </AvGroup>
              <AvGroup>
                <Label id="urunKategorisiLabel" for="urun-urunKategorisi">
                  <Translate contentKey="koopApp.urun.urunKategorisi">Urun Kategorisi</Translate>
                </Label>
                <AvInput
                  id="urun-urunKategorisi"
                  type="select"
                  className="form-control"
                  name="urunKategorisi"
                  value={(!isNew && urunEntity.urunKategorisi) || 'GIDA'}
                >
                  <option value="GIDA">{translate('koopApp.UrunKategorisi.GIDA')}</option>
                  <option value="GIDA_DISI">{translate('koopApp.UrunKategorisi.GIDA_DISI')}</option>
                </AvInput>
              </AvGroup>
              <AvGroup check>
                <Label id="activeLabel">
                  <AvInput id="urun-active" type="checkbox" className="form-check-input" name="active" />
                  <Translate contentKey="koopApp.urun.active">Active</Translate>
                </Label>
              </AvGroup>
              <AvGroup>
                <Label for="urun-urunSorumlusu">
                  <Translate contentKey="koopApp.urun.urunSorumlusu">Urun Sorumlusu</Translate>
                </Label>
                <AvInput id="urun-urunSorumlusu" type="select" className="form-control" name="urunSorumlusu.id">
                  <option value="" key="0" />
                  {users
                    ? users.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.login}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label for="urun-kdvKategorisi">
                  <Translate contentKey="koopApp.urun.kdvKategorisi">Kdv Kategorisi</Translate>
                </Label>
                <AvInput id="urun-kdvKategorisi" type="select" className="form-control" name="kdvKategorisi.id">
                  <option value="" key="0" />
                  {kdvKategorisis
                    ? kdvKategorisis.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.id}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/urun" replace color="info">
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
  users: storeState.userManagement.users,
  kdvKategorisis: storeState.kdvKategorisi.entities,
  urunFiyatHesaps: storeState.urunFiyatHesap.entities,
  urunEntity: storeState.urun.entity,
  loading: storeState.urun.loading,
  updating: storeState.urun.updating,
  updateSuccess: storeState.urun.updateSuccess
});

const mapDispatchToProps = {
  getUsers,
  getKdvKategorisis,
  getUrunFiyatHesaps,
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(UrunUpdate);
