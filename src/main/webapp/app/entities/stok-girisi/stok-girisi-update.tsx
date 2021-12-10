import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Label, Row } from 'reactstrap';
import { AvField, AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';
import { Translate, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';
import { getUsers } from 'app/modules/administration/user-management/user-management.reducer';
import { getAllUrunForStokGirisi, updateEntity as updateUrun } from 'app/entities/urun/urun.reducer';
import { createEntity, getEntity, reset, updateEntity } from './stok-girisi.reducer';
import { getUrunFiyatHesapByUrunId } from 'app/entities/urun-fiyat-hesap/urun-fiyat-hesap.reducer.ts';
import { defaultValue } from 'app/shared/model/stok-girisi.model';
import { convertDateTimeToServer } from 'app/shared/util/date-utils';
import { Dropdown } from 'primereact/dropdown';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import { AUTHORITIES } from 'app/config/constants';
import { Birim } from 'app/shared/model/enumerations/birim.model';

export interface IStokGirisiUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const StokGirisiUpdate = (props: IStokGirisiUpdateProps) => {
  const [userId, setUserId] = useState('0');
  const [stokGirisi, setStokGirisi] = useState(defaultValue);
  const [urunId, setUrunId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);
  const [kargo, setKargo] = useState(0);
  const [birimFiyat, setBirimFiyat] = useState(0);
  const [fiyatHesaplamaString, setFiyatHesaplamaString] = useState('');
  const [yeniFiyat, setYeniFiyat] = useState(0);
  const [secilmisStokHareketi, setSecilmisStokHareketi] = useState('STOK_GIRISI');

  const { stokGirisiEntity, users, loading, updating, satisUrunleri, isAdmin, urunFiyatHesapEntity } = props;

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
      // const urun = {
      //   ...stokGirisi.urun,
      //   musteriFiyati: yeniFiyat
      // };

      // const entity = {
      //   ...stokGirisiEntity,
      //   ...stokGirisi,
      //   ...values,
      //   urun
      // };

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
    // const urun = e.target.value;
    // props.getUrunFiyatHesapByUrunId(urun.id);
    setStokGirisi({
      ...stokGirisi,
      [e.target.name]: e.target.value,
    });
  };

  const updateStokGirisiMiktar = e => {
    setStokGirisi({
      ...stokGirisi,
      [e.target.name]: e.target.value,
    });
  };

  const updateStokHareketi = e => {
    setSecilmisStokHareketi(e.target.value);
  };

  const fiyatHesapla = () => {
    let kdvDahilBiriFiyat = 0;
    if (stokGirisi.urun.birim === Birim.GRAM) {
      kdvDahilBiriFiyat = birimFiyat + birimFiyat * stokGirisi.urun.kdvKategorisi.kdvOrani * 0.01 + kargo / (stokGirisi.miktar * 0.001);
    } else {
      kdvDahilBiriFiyat = birimFiyat + birimFiyat * stokGirisi.urun.kdvKategorisi.kdvOrani * 0.01 + kargo / stokGirisi.miktar;
    }
    const urunFiyatHesap = urunFiyatHesapEntity;
    let koopFiyati =
      kdvDahilBiriFiyat +
      0.01 *
        kdvDahilBiriFiyat *
        (urunFiyatHesap.amortisman +
          urunFiyatHesap.dayanisma +
          urunFiyatHesap.dukkanGider +
          urunFiyatHesap.fire +
          urunFiyatHesap.giderPusulaMustahsil +
          urunFiyatHesap.kooperatifCalisma);
    koopFiyati = Number((Math.round(koopFiyati * 4) / 4).toFixed(2));
    if (stokGirisi.urun.musteriFiyati !== koopFiyati) {
      setFiyatHesaplamaString(
        'FİYAT DEĞİŞTİ ==> Eski fiyat: ' +
          stokGirisi.urun.musteriFiyati +
          '  Yeni fiyat: ' +
          koopFiyati +
          '   Stok girerseniz ürün fiyatı da otomatik olarak güncellenecek!'
      );
      setYeniFiyat(koopFiyati);
    } else {
      setFiyatHesaplamaString('Fiyatta değişiklik yok');
    }
  };

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
                  <AvInput id="stok-girisi-id" type="text" className="form-control" name="id" readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                {!isNew ? (
                  <AvInput id="stok-girisi-urun" type="text" className="form-control" name="urun.urunAdi" readOnly />
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
                        number: { value: true, errorMessage: translate('entity.validation.number') },
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
                  onChange={updateStokHareketi}
                  value={(!isNew && stokGirisiEntity.stokHareketiTipi) || 'STOK_GIRISI'}
                >
                  <option value="STOK_GIRISI">{translate('koopApp.StokHareketiTipi.STOK_GIRISI')}</option>
                  <option style={isAdmin ? {} : { display: 'none' }} value="FIRE">
                    {translate('koopApp.StokHareketiTipi.FIRE')}
                  </option>
                  <option style={isAdmin ? {} : { display: 'none' }} value="STOK_DUZELTME">
                    {translate('koopApp.StokHareketiTipi.STOK_DUZELTME')}
                  </option>
                  <option value="MASRAF">{translate('koopApp.StokHareketiTipi.MASRAF')}</option>
                  <option value="IADE">{translate('koopApp.StokHareketiTipi.IADE')}</option>
                  <option value="ERZAK_DESTEGI">ERZAK_DESTEGI</option>
                </AvInput>
              </AvGroup>
              {/* fiyat hesaplama */}
              {/* <div className="urun-sinir" style={secilmisStokHareketi === StokHareketiTipi.STOK_GIRISI ? {} : {display: 'none'}}>
                <Label>
                  Ürün Fiyat Hesaplaması
                </Label>
                <Col>
                  <Col>
                    <Label>
                      Kargo Gideri
                    </Label>
                  </Col>
                  <Col>
                    <InputNumber type="number" onChange={(value) => setKargo(value)}/>
                  </Col>
                  <Col>
                    <Label>
                      KDV Hariç Ürünün Birim Fiyatı
                    </Label>
                  </Col>
                  <Col>
                    <InputNumber type="number" onChange={(value) => setBirimFiyat(value)}/>
                  </Col>
                  <Col>
                    <Button onClick={() => fiyatHesapla()} replace color="info">
                      <FontAwesomeIcon icon="arrow-left"/>
                      &nbsp;
                      <span className="d-none d-md-inline">
                        Fiyat Hesapla
                      </span>
                    </Button>
                  </Col>
                  <Col>
                    {fiyatHesaplamaString}
                  </Col>
                </Col>
              </div>
              */}
              {/* fiyat hesaplama bitis */}
              <AvGroup>
                <Label id="notlarLabel" for="stok-girisi-notlar">
                  <Translate contentKey="koopApp.stokGirisi.notlar">Notlar</Translate>
                </Label>
                <AvField
                  id="stok-girisi-notlar"
                  type="text"
                  name="notlar"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                  }}
                />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/stok-girisi" replace color="info">
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
