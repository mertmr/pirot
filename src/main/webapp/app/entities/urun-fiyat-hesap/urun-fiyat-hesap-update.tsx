import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IUrun } from 'app/shared/model/urun.model';
import {getAllUrunForStokGirisi, getEntities as getUruns} from 'app/entities/urun/urun.reducer';
import { getEntity, updateEntity, createEntity, reset } from './urun-fiyat-hesap.reducer';
import {defaultValue, IUrunFiyatHesap} from 'app/shared/model/urun-fiyat-hesap.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import {Dropdown} from "primereact/dropdown";

export interface IUrunFiyatHesapUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const UrunFiyatHesapUpdate = (props: IUrunFiyatHesapUpdateProps) => {
  const [urunId, setUrunId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);
  const [urunFiyatHesap, setUrunFiyatHesap] = useState(defaultValue);

  const { urunFiyatHesapEntity, uruns, loading, updating, satisUrunleri } = props;

  const handleClose = () => {
    props.history.push('/urun-fiyat-hesap' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getUruns();
    props.getAllUrunForStokGirisi();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  useEffect(() => {
    if (urunFiyatHesapEntity) {
      setUrunFiyatHesap({
        ...urunFiyatHesap,
        ...urunFiyatHesapEntity
      });
    }
  }, [props.satisUrunleri, props.urunFiyatHesapEntity]);

  const updateStokGirisi = e => {
    setUrunFiyatHesap({
      ...urunFiyatHesap,
      [e.target.name]: e.target.value
    });
  };

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...urunFiyatHesapEntity,
        ...values,
        ...urunFiyatHesap
      };

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
          <h2 id="koopApp.urunFiyatHesap.home.createOrEditLabel">
            <Translate contentKey="koopApp.urunFiyatHesap.home.createOrEditLabel">Create or edit a UrunFiyatHesap</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : urunFiyatHesapEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="urun-fiyat-hesap-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="urun-fiyat-hesap-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="amortismanLabel" for="urun-fiyat-hesap-amortisman">
                  <Translate contentKey="koopApp.urunFiyatHesap.amortisman">Amortisman</Translate>
                </Label>
                <AvField id="urun-fiyat-hesap-amortisman" type="string" className="form-control" name="amortisman" />
              </AvGroup>
              <AvGroup>
                <Label id="giderPusulaMustahsilLabel" for="urun-fiyat-hesap-giderPusulaMustahsil">
                  <Translate contentKey="koopApp.urunFiyatHesap.giderPusulaMustahsil">Gider Pusula Mustahsil</Translate>
                </Label>
                <AvField id="urun-fiyat-hesap-giderPusulaMustahsil" type="string" className="form-control" name="giderPusulaMustahsil" />
              </AvGroup>
              <AvGroup>
                <Label id="dukkanGiderLabel" for="urun-fiyat-hesap-dukkanGider">
                  <Translate contentKey="koopApp.urunFiyatHesap.dukkanGider">Dukkan Gider</Translate>
                </Label>
                <AvField id="urun-fiyat-hesap-dukkanGider" type="string" className="form-control" name="dukkanGider" />
              </AvGroup>
              <AvGroup>
                <Label id="kooperatifCalismaLabel" for="urun-fiyat-hesap-kooperatifCalisma">
                  <Translate contentKey="koopApp.urunFiyatHesap.kooperatifCalisma">Kooperatif Calisma</Translate>
                </Label>
                <AvField id="urun-fiyat-hesap-kooperatifCalisma" type="string" className="form-control" name="kooperatifCalisma" />
              </AvGroup>
              <AvGroup>
                <Label id="dayanismaLabel" for="urun-fiyat-hesap-dayanisma">
                  <Translate contentKey="koopApp.urunFiyatHesap.dayanisma">Dayanisma</Translate>
                </Label>
                <AvField id="urun-fiyat-hesap-dayanisma" type="string" className="form-control" name="dayanisma" />
              </AvGroup>
              <AvGroup>
                <Label id="fireLabel" for="urun-fiyat-hesap-fire">
                  <Translate contentKey="koopApp.urunFiyatHesap.fire">Fire</Translate>
                </Label>
                <AvField id="urun-fiyat-hesap-fire" type="string" className="form-control" name="fire" />
              </AvGroup>
              <AvGroup>
                <Dropdown
                  value={urunFiyatHesap.urun}
                  options={satisUrunleri}
                  optionLabel="urunAdi"
                  name="urun"
                  onChange={updateStokGirisi}
                  filter={true}
                  filterPlaceholder="Ürün seçiniz"
                  filterBy="urunAdi"
                  placeholder="Ürün seçiniz"
                />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/urun-fiyat-hesap" replace color="info">
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
  uruns: storeState.urun.entities,
  urunFiyatHesapEntity: storeState.urunFiyatHesap.entity,
  loading: storeState.urunFiyatHesap.loading,
  updating: storeState.urunFiyatHesap.updating,
  updateSuccess: storeState.urunFiyatHesap.updateSuccess,
  satisUrunleri: storeState.urun.satisUrunleri
});

const mapDispatchToProps = {
  getUruns,
  getEntity,
  updateEntity,
  createEntity,
  reset,
  getAllUrunForStokGirisi
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(UrunFiyatHesapUpdate);
