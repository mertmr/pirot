import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {Link, RouteComponentProps} from 'react-router-dom';
import {Button, Col, Label, Row} from 'reactstrap';
import {AvField, AvForm, AvGroup, AvInput} from 'availity-reactstrap-validation';
import {Translate, translate} from 'react-jhipster';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {IRootState} from 'app/shared/reducers';
import {getUsers} from 'app/modules/administration/user-management/user-management.reducer';
import {getAllUrunForStokGirisi, updateEntity as updateUrun} from 'app/entities/urun/urun.reducer';
import {createEntity, getEntity, reset, updateEntity} from './stok-girisi.reducer';
import {getUrunFiyatHesapByUrunId} from 'app/entities/urun-fiyat-hesap/urun-fiyat-hesap.reducer.ts';
import {defaultValue} from 'app/shared/model/stok-girisi.model';
import {convertDateTimeToServer} from 'app/shared/util/date-utils';
import {Dropdown} from 'primereact/dropdown';
import 'primereact/resources/themes/nova/theme.css';
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';
import {hasAnyAuthority} from 'app/shared/auth/private-route';
import {AUTHORITIES} from 'app/config/constants';

export interface IStokGirisiUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {
}

export const StokGirisiUpdate = (props: IStokGirisiUpdateProps) => {
  const [stokGirisi, setStokGirisi] = useState(defaultValue);
  const [yeniStok, setYeniStok] = useState(0);
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const {stokGirisiEntity, users, loading, updating, satisUrunleri, isAdmin, urunFiyatHesapEntity} = props;

  const handleClose = () => {
    props.history.push('/stok-girisi' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getUsers();
    props.getAllUrunForStokGirisi();
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
        ...stokGirisiEntity,
        ...stokGirisi,
        ...values,
      };

      if (isNew) {
        props.createEntity(entity);
      } else {
        props.updateEntity(entity);
      }
    }
  };

  const updateStokGirisi = e => {
    setStokGirisi({
      ...stokGirisi,
      [e.target.name]: e.target.value,
    });
  };

  const updateStokGirisiMiktar = e => {
    setStokGirisi({
      ...stokGirisi,
      [e.target.name]: Number(e.target.value),
    });
  };

  const updateStokHareketi = stokHareketiTipi => {
    setStokGirisi({
      ...stokGirisi,
      ['stokHareketiTipi']: stokHareketiTipi,
    });
    if (stokHareketiTipi === 'STOK_GIRISI') {
      setYeniStok(stokGirisi.miktar + stokGirisi.urun.stok);
    } else if (stokHareketiTipi === 'FIRE') {
      setYeniStok(stokGirisi.urun.stok - stokGirisi.miktar);
    } else if (stokHareketiTipi === 'STOK_DUZELTME') {
      setYeniStok(stokGirisi.urun.stok + stokGirisi.miktar);
    } else if (stokHareketiTipi === 'MASRAF') {
      setYeniStok(stokGirisi.urun.stok - stokGirisi.miktar);
    } else if (stokHareketiTipi === 'IADE') {
      setYeniStok(stokGirisi.urun.stok - stokGirisi.miktar);
    } else if (stokHareketiTipi === 'ERZAK_DESTEGI') {
      setYeniStok(stokGirisi.urun.stok - stokGirisi.miktar);
    }
  };

  useEffect(() => {
    if (stokGirisi.stokHareketiTipi) {
      updateStokHareketi(stokGirisi.stokHareketiTipi);
    } else {
      updateStokHareketi('STOK_GIRISI');
    }
  }, [stokGirisi.miktar]);

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="koopApp.stokGirisi.home.createOrEditLabel">
            <Translate contentKey="koopApp.stokGirisi.home.createOrEditLabel">Create or edit a StokGirisi</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : stokGirisiEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="stok-girisi-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="stok-girisi-id" type="text" className="form-control" name="id" readOnly/>
                </AvGroup>
              ) : null}
              <AvGroup>
                {!isNew ? (
                  <AvInput id="stok-girisi-urun" type="text" className="form-control" name="urun.urunAdi" readOnly/>
                ) : (
                  <Dropdown
                    value={stokGirisi.urun}
                    options={satisUrunleri}
                    optionLabel="urunAdi"
                    name="urun"
                    onChange={updateStokGirisi}
                    filter={true}
                    filterPlaceholder="Ürün seçiniz"
                    filterBy="urunAdi"
                    placeholder="Ürün seçiniz"
                  />
                )}
              </AvGroup>
              <AvGroup>
                <Label for="stok-girisi-current-miktar">
                  Güncel Stok: {stokGirisi.urun.stok} {stokGirisi.urun.birim}
                </Label>
              </AvGroup>
              <AvGroup>
                <Label id="miktarLabel" for="stok-girisi-miktar">
                  <Translate contentKey="koopApp.stokGirisi.miktar">Miktar</Translate>
                </Label>
                <Row>
                  <Col>
                    <AvField
                      id="stok-girisi-miktar"
                      type="number"
                      className="form-control"
                      name="miktar"
                      onChange={updateStokGirisiMiktar}
                      validate={{
                        number: {value: true, errorMessage: translate('entity.validation.number')},
                      }}
                    />
                  </Col>
                  <Col>{stokGirisi.urun.birim}</Col>
                </Row>
              </AvGroup>
              <AvGroup>
                <Label id="stokHareketiTipiLabel" for="stok-girisi-stokHareketiTipi">
                  <Translate contentKey="koopApp.stokGirisi.stokHareketiTipi">Stok Hareketi Tipi</Translate>
                </Label>
                <AvInput
                  id="stok-girisi-stokHareketiTipi"
                  type="select"
                  className="form-control"
                  name="stokHareketiTipi"
                  onChange={(e => updateStokHareketi(e.target.value))}
                  value={(!isNew && stokGirisiEntity.stokHareketiTipi) || 'STOK_GIRISI'}
                >
                  <option value="STOK_GIRISI">{translate('koopApp.StokHareketiTipi.STOK_GIRISI')}</option>
                  <option style={isAdmin ? {} : {display: 'none'}} value="FIRE">
                    {translate('koopApp.StokHareketiTipi.FIRE')}
                  </option>
                  <option style={isAdmin ? {} : {display: 'none'}} value="STOK_DUZELTME">
                    {translate('koopApp.StokHareketiTipi.STOK_DUZELTME')}
                  </option>
                  <option value="MASRAF">{translate('koopApp.StokHareketiTipi.MASRAF')}</option>
                  <option value="IADE">{translate('koopApp.StokHareketiTipi.IADE')}</option>
                  <option value="ERZAK_DESTEGI">ERZAK_DESTEGI</option>
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label for="stok-girisi-current-miktar">
                  Kaydedilecek Yeni Stok: {yeniStok} {stokGirisi.urun.birim}
                </Label>
              </AvGroup>
              <AvGroup>
                <Label id="notlarLabel" for="stok-girisi-notlar">
                  <Translate contentKey="koopApp.stokGirisi.notlar">Notlar</Translate>
                </Label>
                <AvField
                  id="stok-girisi-notlar"
                  type="text"
                  name="notlar"
                  value={(!isNew && stokGirisiEntity.notlar) || 'Stok girişi'}
                  validate={{
                    required: {value: true, errorMessage: translate('entity.validation.required')},
                  }}
                />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/stok-girisi" replace color="info">
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
  users: storeState.userManagement.users,
  satisUrunleri: storeState.urun.satisUrunleri,
  stokGirisiEntity: storeState.stokGirisi.entity,
  loading: storeState.stokGirisi.loading,
  updating: storeState.stokGirisi.updating,
  updateSuccess: storeState.stokGirisi.updateSuccess,
  isAdmin: hasAnyAuthority(storeState.authentication.account.authorities, [AUTHORITIES.ADMIN]),
  urunFiyatHesapEntity: storeState.urunFiyatHesap.entity,
});

const mapDispatchToProps = {
  getUsers,
  getEntity,
  updateEntity,
  createEntity,
  reset,
  getAllUrunForStokGirisi,
  updateUrun,
  getUrunFiyatHesapByUrunId,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(StokGirisiUpdate);
