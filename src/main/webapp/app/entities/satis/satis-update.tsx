import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {Link, RouteComponentProps} from 'react-router-dom';
import {Button, Col, Label, Row, Table} from 'reactstrap';
import {AvForm, AvGroup, AvInput} from 'availity-reactstrap-validation';
import {Translate} from 'react-jhipster';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {IRootState} from 'app/shared/reducers';
import {getUsers} from 'app/modules/administration/user-management/user-management.reducer';
import {createEntity, getEntity, reset, updateEntity} from './satis.reducer';
import {
  createEntity as createStokHareketi,
  updateEntity as updateStokHareketi
} from '../satis-stok-hareketleri/satis-stok-hareketleri.reducer';
import {convertDateTimeFromServer, convertDateTimeToServer} from 'app/shared/util/date-utils';
import {defaultValue as satisDefault, defaultValueWithNew} from "app/shared/model/satis.model";
import {defaultValueList as kdvDefaultList} from "app/shared/model/kdv-kategorisi.model";
import {ISatisStokHareketleri} from "app/shared/model/satis-stok-hareketleri.model";
import {DatePicker, InputNumber, Select} from 'antd';
import 'antd/lib/input-number/style/index.css';
import 'antd/lib/date-picker/style/index.css';
import 'antd/lib/select/style/index.css';
import 'antd/lib/input/style/index.css';
import {getSatisUrunleri} from "app/entities/urun/urun.reducer";
import moment from 'moment';
import 'moment/locale/tr';
import {APP_LOCAL_DATETIME_FORMAT} from "app/config/constants";
import {Dropdown} from 'primereact/dropdown';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';
// import 'primeflex/primeflex.css';
// import './sass/App.scss';

export interface ISatisUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {
}

export const SatisUpdate = (props: ISatisUpdateProps) => {

  const [paraUstu, setParaUstu] = useState(0);
  const [nakit, setNakit] = useState(0);
  const [kdvKategorisiList, setKdvKategorisiList] = useState(kdvDefaultList);
  const [satis, setSatis] = useState(satisDefault);

  const yeniUrun = {
    miktar: 0,
    urun: {
      id: 0,
      urunAdi: "Ürün seçiniz",
      musteriFiyati: 0
    }
  };
  const [stokHareketleriListState, setStokHareketleriLists] = useState([yeniUrun] as ISatisStokHareketleri[]);
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const {satisEntity, users, loading, updating} = props;

  const handleClose = () => {
    props.history.push('/satis' + props.location.search);
  };

  const addRow = () => {
    setStokHareketleriLists([...stokHareketleriListState, yeniUrun]);
  };

  const onChangeParaUstu = (value) => {
    setNakit(value);
    setParaUstu(value - satis.toplamTutar);
  };

  const toplamHesapla = (stokHareketleriListesi) => {
    let toplamTutar = 0;
    for (const stokHareketi of stokHareketleriListesi) {
      toplamTutar += stokHareketi.tutar;
    }
    toplamTutar = Number((Math.round(toplamTutar * 4) / 4).toFixed(2));
    setSatis({
      ...satis,
      toplamTutar
    });
    if (nakit && nakit > 0) {
      setParaUstu(nakit - toplamTutar);
    }
  };

  const kdvListesiCikar = (secilenUrun) => {
    const indexOfKdv = kdvKategorisiList.map(a => a.id).indexOf(secilenUrun.urun.kdvKategorisi.id);
    const yeniKdvList = [...kdvKategorisiList];
    yeniKdvList.splice(indexOfKdv, 1);
    setKdvKategorisiList([...yeniKdvList]);
  };

  const kdvListesiEkle = (secilenUrun) => {
    const exist = kdvKategorisiList.map(a => a.id).includes(secilenUrun.kdvKategorisi.id);
    if (!exist) {
      const yeniKdvList = [...kdvKategorisiList];
      setKdvKategorisiList([...yeniKdvList, secilenUrun.kdvKategorisi]);
    }
  };

  const deleteRow = (i) => {
    const yeniUrunler = [...stokHareketleriListState];
    yeniUrunler.splice(i, 1);
    setStokHareketleriLists(yeniUrunler);
    toplamHesapla(yeniUrunler);
    kdvListesiCikar(stokHareketleriListState[i])
  };

  const onChangeMiktar = (value, i) => {
    const yeniUrunler = [...stokHareketleriListState];
    yeniUrunler[i].miktar = value;
    if (yeniUrunler[i].urun.birim.toString() === 'GRAM')
      yeniUrunler[i].tutar = Number((value * 0.001 * yeniUrunler[i].urun.musteriFiyati).toFixed(2));
    else
      yeniUrunler[i].tutar = Number((value * yeniUrunler[i].urun.musteriFiyati).toFixed(2));
    setStokHareketleriLists(yeniUrunler);
    toplamHesapla(yeniUrunler);
  };

  const {satisUrunleri} = props;

  const onChangeUrun = (e) => {
    const yeniUrunler = [...stokHareketleriListState];
    const secilenUrun = e.value;
    yeniUrunler[e.target.name].urun = secilenUrun;
    yeniUrunler[e.target.name].miktar = 1;
    yeniUrunler[e.target.name].tutar = secilenUrun.musteriFiyati * yeniUrunler[e.target.name].miktar;
    setStokHareketleriLists(yeniUrunler);
    toplamHesapla(yeniUrunler);
    kdvListesiEkle(secilenUrun);
    addRow();
  };

  const updateDateSatisField = (value, dateString) => {
    setSatis({
      ...satis,
      ["tarih"]: dateString
    });
  };

  const {Option} = Select;

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getUsers();
  }, []);

  useEffect(() => {
    if (isNew) {
      setStokHareketleriLists([{
        miktar: 0,
        urun: {
          id: 0,
          urunAdi: "Ürün seçiniz",
          musteriFiyati: 0
        }
      }]);
      setSatis(defaultValueWithNew);
    } else {
      setStokHareketleriLists([]);
      setStokHareketleriLists([...satisEntity.stokHareketleriLists]);
      const kdvKategorisis = satisEntity.stokHareketleriLists.map(value => value.urun.kdvKategorisi);
      setKdvKategorisiList([...kdvKategorisis]);
    }
  }, [satisEntity.stokHareketleriLists]);

  useEffect(() => {
    props.getSatisUrunleri();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    if (satis.tarih) {
      values.tarih = convertDateTimeToServer(satis.tarih);
    } else if (satisEntity.tarih) {
      values.tarih = convertDateTimeToServer(satisEntity.tarih);
    } else {
      values.tarih = new Date();
    }

    let toplamTutar = 0;
    const stokHareketleriLists = stokHareketleriListState.filter(stokHareketi => (stokHareketi.urun.id !== 0));
    for (const stokHareketi of stokHareketleriLists) {
      if(stokHareketi.urun == null)
      toplamTutar += stokHareketi.tutar;
    }
    toplamTutar = Number((Math.round(toplamTutar * 4) / 4).toFixed(2));

    if (errors.length === 0) {
      if (isNew) {
        const yenisatis = {
          ...satis,
          satisEntity,
          stokHareketleriLists,
          toplamTutar,
          ...values
        };
        props.createEntity(yenisatis);
      } else {
        let yenisatis = {
          ...satisEntity
        };
        yenisatis = {
          ...yenisatis,
          stokHareketleriLists,
          toplamTutar,
          ...values
        };
        props.updateEntity(yenisatis);
      }
    }
  };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="koopApp.satis.home.createOrEditLabel">
            <Translate contentKey="koopApp.satis.home.createOrEditLabel">Create or edit a Satis</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : satisEntity} onSubmit={saveEntity}>
              <Button
                tag={Link}
                onClick={addRow}
                color="primary"
                size="sm"
              >
                <FontAwesomeIcon icon="pencil-alt"/>{' '}
                <span className="d-none d-md-inline">Yeni Ürün Ekle</span>
              </Button>
              <div className="table-responsive">
                {stokHareketleriListState && stokHareketleriListState.length > 0 ? (
                  <Table responsive>
                    <thead>
                    <tr>
                      <th>
                        <Translate contentKey="koopApp.satisStokHareketleri.urun">Urun</Translate>
                      </th>
                      <th className="hand">
                        Birim Fiyat
                      </th>
                      <th className="hand">
                        Kalan Stok
                      </th>
                      <th className="hand">
                        <Translate contentKey="koopApp.satisStokHareketleri.miktar">Miktar</Translate>
                      </th>
                      <th className="hand">
                        <Translate contentKey="koopApp.satisStokHareketleri.tutar">Tutar</Translate>
                      </th>
                      <th/>
                    </tr>
                    </thead>
                    <tbody>
                    {stokHareketleriListState.map((stokHareketi, i) => (
                      <tr key={`entity-${i}`}>
                        <td>
                          <Dropdown value={stokHareketi.urun} options={satisUrunleri}
                                    optionLabel="urunAdi" onChange={onChangeUrun}
                                    filter={true} name={`${i}`} style={{width: '400px'}}
                                    filterPlaceholder="Ürün seçiniz" filterBy="urunAdi" placeholder="Ürün seçiniz"/>
                        </td>
                        <td>{stokHareketi.urun.musteriFiyati} TL</td>
                        <td>{stokHareketi.urun.stok}</td>
                        <td><InputNumber value={stokHareketi.miktar}
                                         onChange={(value) => onChangeMiktar(value, i)}/>
                        </td>
                        <td>{stokHareketi.tutar} TL</td>
                        <td className="text-right">
                          <div className="btn-group flex-btn-group-container">
                            <Button
                              tag={Link}
                              color="danger"
                              size="sm"
                              onClick={(() => deleteRow(i))}
                            >
                              <FontAwesomeIcon icon="trash"/>{' '}
                              <span className="d-none d-md-inline">SİL</span>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    </tbody>
                    <tr>
                      <td/>
                      <td/>
                      <td/>
                      <td/>
                      <td>
                        <div className="text-right">
                          <Label for="satis-toplamTutar">
                            <Translate contentKey="koopApp.satis.toplamTutar"/>
                          </Label>
                          <AvInput id="satis-toplamTutar" type="text" value={satis.toplamTutar} className="form-control"
                                   name="toplamTutar" disabled
                                   readOnly/>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td/>
                      <td/>
                      <td/>
                      <td/>
                      <td>
                        <div className="text-right">
                          <Label for="satis-nakitTutar">
                            Nakit Verilen
                          </Label>
                          <InputNumber onChange={(value) => onChangeParaUstu(value)}/>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td/>
                      <td/>
                      <td/>
                      <td/>
                      <td>
                        <div className="text-right">
                          <Label for="satis-paraustu">
                            Para Üstü
                          </Label>
                          <InputNumber value={paraUstu}/>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <AvGroup>
                        <Label for="gider-user">
                          Satış Tarihi
                        </Label>
                        <DatePicker showTime
                                    name="tarih" className="form-control"
                                    placeholder="Tarih Seçin"
                                    onChange={updateDateSatisField}
                                    defaultValue={isNew ? moment(new Date(), 'YYYY-MM-DD') :
                                      moment(convertDateTimeFromServer(props.satisEntity.tarih), APP_LOCAL_DATETIME_FORMAT)}/>
                      </AvGroup>
                      <AvGroup check>
                        <Label id="kartliSatisLabel">
                          <AvInput id="satis-kartliSatis" type="checkbox" className="form-check-input"
                                   name="kartliSatis"/>
                          <Translate contentKey="koopApp.satis.kartliSatis">Kartli Satis</Translate>
                        </Label>
                      </AvGroup>
                      <AvGroup check>
                        <Label id="ortagaSatisLabel">
                          <AvInput id="satis-ortagaSatis" type="checkbox" className="form-check-input"
                                   name="ortagaSatis"/>
                          <Translate contentKey="koopApp.satis.ortagaSatis">Ortaga Satis</Translate>
                        </Label>
                      </AvGroup>
                    </tr>
                  </Table>
                ) : (
                  <div className="alert alert-warning">
                  </div>
                )}
              </div>
              <div className="table-responsive">
                {kdvKategorisiList && kdvKategorisiList.length > 0 ? (
                  <Table responsive>
                    <thead>
                    <tr>
                      <th className="hand">
                        <Translate contentKey="koopApp.kdvKategorisi.kategoriAdi">Kategori Adi</Translate>
                        <FontAwesomeIcon icon="sort"/>
                      </th>
                      <th className="hand">
                        <Translate contentKey="koopApp.kdvKategorisi.kdvOrani">Kdv Orani</Translate>
                      </th>
                      <th/>
                    </tr>
                    </thead>
                    <tbody>
                    {kdvKategorisiList.map((kdvKategorisi, i) => (
                      <tr key={`entity-${i}`}>
                        <td>{kdvKategorisi.kategoriAdi}</td>
                        <td>{kdvKategorisi.kdvOrani}</td>
                      </tr>
                    ))}
                    </tbody>
                  </Table>
                ) : (
                  <div className="alert alert-warning">
                  </div>
                )}
              </div>
              {!isNew ? (
                <AvGroup>
                  <Label for="satis-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="satis-id" type="text" className="form-control" name="id" required readOnly on/>
                </AvGroup>
              ) : null}
              <Button tag={Link} id="cancel-save" to="/satis" replace color="info">
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
  satisEntity: storeState.satis.entity,
  loading: storeState.satis.loading,
  updating: storeState.satis.updating,
  updateSuccess: storeState.satis.updateSuccess,
  satisUrunleri: storeState.urun.satisUrunleri
});

const mapDispatchToProps = {
  getUsers,
  getEntity,
  updateEntity,
  createEntity,
  reset,
  getSatisUrunleri,
  createStokHareketi,
  updateStokHareketi
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(SatisUpdate);
