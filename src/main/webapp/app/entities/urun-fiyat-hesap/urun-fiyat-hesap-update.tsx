import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IUrun } from 'app/shared/model/urun.model';
import { getAllUrunForStokGirisi, getEntities as getUruns } from 'app/entities/urun/urun.reducer';
import { getEntity, updateEntity, createEntity, reset } from './urun-fiyat-hesap.reducer';
import { defaultValue, IUrunFiyatHesap } from 'app/shared/model/urun-fiyat-hesap.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { Dropdown } from 'primereact/dropdown';
import { FATURA_TIPI } from "app/shared/model/enumerations/fatura-tipi.model";
import { Birim } from "app/shared/model/enumerations/birim.model";
import { IFiyat } from "app/shared/model/fiyat.model";

export interface IUrunFiyatHesapUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const UrunFiyatHesapUpdate = (props: IUrunFiyatHesapUpdateProps) => {
  const [urunId, setUrunId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);
  const [urunFiyatHesap, setUrunFiyatHesap] = useState(defaultValue);
  const [birimFiyat, setBirimFiyat] = useState(0);
  const [payliBirimFiyat, setpayliBirimFiyat] = useState(0);

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
        ...urunFiyatHesapEntity,
      });
    }
  }, [props.satisUrunleri, props.urunFiyatHesapEntity]);

  const updateUrunFiyatHesap = e => {
    setUrunFiyatHesap({
      ...urunFiyatHesap,
      [e.target.name]: e.target.value,
    });
  };

  const updateDukkanGider = e => {
    setUrunFiyatHesap({
      ...urunFiyatHesap,
      [e.target.name]: Number(e.target.value),
    });
  };

  const setGiderPusula = e => {
    let giderPusulaMustahsil;
    const faturaTipi = e;
    if(e !== FATURA_TIPI.FATURA) {
      giderPusulaMustahsil = 5;
    } else {
      giderPusulaMustahsil = 0;
    }

    setUrunFiyatHesap({
      ...urunFiyatHesap,
      giderPusulaMustahsil,
      faturaTipi,
    });
  };

  const setDayanisma = e => {
    let amortisman;
    let dayanisma;
    let kooperatifCalisma;
    let fire;
    if(e === 'HAYIR') {
      amortisman = 1;
      dayanisma = 1;
      fire = 5;
      kooperatifCalisma = 1;
    } else {
      amortisman = 0;
      dayanisma = 0;
      fire = 0;
      kooperatifCalisma = 0;
    }

    const dukkanGider = 23;
    setUrunFiyatHesap({
      ...urunFiyatHesap,
      amortisman,
      dayanisma,
      fire,
      kooperatifCalisma,
      dukkanGider,
    });
  };

  const fiyatHesapla = () => {
        let kdvDahilBirimFiyat;
        if(urunFiyatHesap.faturaTipi === FATURA_TIPI.FATURA) {
          kdvDahilBirimFiyat = birimFiyat * (1 + 0.01 * urunFiyatHesap.urun.kdvKategorisi.kdvOrani);
        } else {
          kdvDahilBirimFiyat = birimFiyat;
        }

        const koopPayi = urunFiyatHesap.amortisman +
          urunFiyatHesap.dayanisma +
          urunFiyatHesap.dukkanGider +
          urunFiyatHesap.fire +
          urunFiyatHesap.giderPusulaMustahsil +
          urunFiyatHesap.kooperatifCalisma;
        let koopFiyati = kdvDahilBirimFiyat * (1 + 0.01 * koopPayi);
        koopFiyati = Number((Math.round(koopFiyati * 4) / 4).toFixed(2));

    setpayliBirimFiyat(koopFiyati);
  };

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...urunFiyatHesapEntity,
        ...urunFiyatHesap,
        ...values,
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
                <Dropdown
                  value={urunFiyatHesap.urun}
                  options={satisUrunleri}
                  optionLabel="urunAdi"
                  name="urun"
                  onChange={updateUrunFiyatHesap}
                  filter={true}
                  filterPlaceholder="Ürün seçiniz"
                  filterBy="urunAdi"
                  placeholder="Ürün seçiniz"
                />
              </AvGroup>
              <AvGroup>
                <Label id="dayanismaLabel" for="dayanisma-dayanismaTipi">
                  Dayanışma Ürünü mü?
                </Label>
                <AvInput
                  id="dayanisma-dayanismaTipi"
                  type="select"
                  className="form-control"
                  name="faturaTipi"
                  value={''}
                  onChange={e => setDayanisma(e.target.value)}
                >
                  <option value="">{''}</option>
                  <option value="HAYIR">{'HAYIR'}</option>
                  <option value="EVET">{'EVET'}</option>
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label id="giderTipiLabel" for="gider-giderTipi">
                  Fatura Tipi
                </Label>
                <AvInput
                  id="gider-giderTipi"
                  type="select"
                  className="form-control"
                  name="faturaTipi"
                  value={(!isNew && urunFiyatHesapEntity.faturaTipi) || ''}
                  onChange={e => setGiderPusula(e.target.value)}
                >
                  <option value="">{''}</option>
                  <option value="FATURA">{'FATURA'}</option>
                  <option value="GIDER">{'GIDER'}</option>
                  <option value="MUSTAHSIL">{'MUSTAHSIL'}</option>
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label id="amortismanLabel" for="urun-fiyat-hesap-amortisman">
                  <Translate contentKey="koopApp.urunFiyatHesap.amortisman">Amortisman</Translate>
                </Label>
                <AvField id="urun-fiyat-hesap-amortisman" type="string" className="form-control" name="amortisman"
                         on value={urunFiyatHesap.amortisman}/>
              </AvGroup>
              <AvGroup>
                <Label id="giderPusulaMustahsilLabel" for="urun-fiyat-hesap-giderPusulaMustahsil">
                  <Translate contentKey="koopApp.urunFiyatHesap.giderPusulaMustahsil">Gider Pusula Mustahsil</Translate>
                </Label>
                <AvField id="urun-fiyat-hesap-giderPusulaMustahsil" type="string"
                         className="form-control" name="giderPusulaMustahsil"
                         on value={urunFiyatHesap.giderPusulaMustahsil} onChange={e => setUrunFiyatHesap(e.target.value)}/>
              </AvGroup>
              <AvGroup>
                <Label id="dukkanGiderLabel" for="urun-fiyat-hesap-dukkanGider">
                  <Translate contentKey="koopApp.urunFiyatHesap.dukkanGider">Dukkan Gider</Translate>
                </Label>
                <AvField id="urun-fiyat-hesap-dukkanGider" type="string" className="form-control" name="dukkanGider"
                         on value={urunFiyatHesap.dukkanGider} onChange={e => updateDukkanGider(e)}/>
              </AvGroup>
              <AvGroup>
                <Label id="kooperatifCalismaLabel" for="urun-fiyat-hesap-kooperatifCalisma">
                  <Translate contentKey="koopApp.urunFiyatHesap.kooperatifCalisma">Kooperatif Calisma</Translate>
                </Label>
                <AvField id="urun-fiyat-hesap-kooperatifCalisma" type="string" className="form-control" name="kooperatifCalisma"
                         on value={urunFiyatHesap.kooperatifCalisma}/>
              </AvGroup>
              <AvGroup>
                <Label id="dayanismaLabel" for="urun-fiyat-hesap-dayanisma">
                  <Translate contentKey="koopApp.urunFiyatHesap.dayanisma">Dayanisma</Translate>
                </Label>
                <AvField id="urun-fiyat-hesap-dayanisma" type="string" className="form-control" name="dayanisma"
                         on value={urunFiyatHesap.dayanisma}/>
              </AvGroup>
              <AvGroup>
                <Label id="fireLabel" for="urun-fiyat-hesap-fire">
                  <Translate contentKey="koopApp.urunFiyatHesap.fire">Fire</Translate>
                </Label>
                <AvField id="urun-fiyat-hesap-fire" type="string" className="form-control" name="fire"
                         on value={urunFiyatHesap.fire}/>
              </AvGroup>
              <AvGroup>
                <Row>
                  <Col>
                    <Label id="hesapId" for="urun-fiyat-hesap-asd">
                      KDVsiz Birim Fiyat
                    </Label>
                <AvField id="urun-fiyat-hesap-asd" type="string" className="form-control" name="birimFiyat"
                         on value={birimFiyat} onChange={e => setBirimFiyat(Number(e.target.value))}/>
                  </Col>
                  <Col>
                    <Label id="hesapId" for="hesaplaButonId">
                      Butonla Fiyat Hesabı Dene
                    </Label>
                    &nbsp;
                    <Button color="primary" id="hesaplaButonId" onClick={fiyatHesapla}>
                      Hesapla
                    </Button>
                  </Col>
                  <Col>
                    <Label id="hesapId" for="urun-fiyat-hesap-asd">
                      Hesaplanan Fiyat
                    </Label>
                <AvField id="urun-fiyat-hesap-asd" type="string" className="form-control" name="payliBirimFiyat"
                         on value={payliBirimFiyat} disabled/>
                </Col>
                </Row>
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
  satisUrunleri: storeState.urun.satisUrunleri,
});

const mapDispatchToProps = {
  getUruns,
  getEntity,
  updateEntity,
  createEntity,
  reset,
  getAllUrunForStokGirisi,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(UrunFiyatHesapUpdate);
