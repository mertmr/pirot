import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Label, Row, Table } from 'reactstrap';
import { AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';
import { Translate } from 'react-jhipster';
import TextField from '@material-ui/core/TextField';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';
import { getUsers } from 'app/modules/administration/user-management/user-management.reducer';
import { createEntity, getEntity, reset, updateEntity } from './satis.reducer';
import {
  createEntity as createStokHareketi,
  updateEntity as updateStokHareketi,
} from '../satis-stok-hareketleri/satis-stok-hareketleri.reducer';
import { convertDateTimeToServer } from 'app/shared/util/date-utils';
import { defaultValue as satisDefault, defaultValueWithNew } from 'app/shared/model/satis.model';
import { defaultValueList as kdvDefaultList } from 'app/shared/model/kdv-kategorisi.model';
import { ISatisStokHareketleri } from 'app/shared/model/satis-stok-hareketleri.model';
import { getAllUrunForStokGirisi, getSatisUrunleri } from 'app/entities/urun/urun.reducer';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';
import { Birim } from 'app/shared/model/enumerations/birim.model';
import { toast } from 'react-toastify';
import cloneDeep from 'lodash/cloneDeep';
import { Calendar } from 'primereact/calendar';
import 'primeflex/primeflex.css';
import Fuse from 'fuse.js';
import { Autocomplete } from '@material-ui/lab';

export interface ISatisUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const SatisUpdate = (props: ISatisUpdateProps) => {
  const [paraUstu, setParaUstu] = useState(0);
  const [nakit, setNakit] = useState(0);
  const [kdvKategorisiList, setKdvKategorisiList] = useState(kdvDefaultList);
  const [satis, setSatis] = useState(satisDefault);
  const [isKrediKartli, setKrediKartli] = useState(false);

  const yeniUrun = {
    miktar: 0,
    urun: {
      id: 0,
      urunAdi: '',
      musteriFiyati: 0,
    },
  };
  const [stokHareketleriListState, setStokHareketleriLists] = useState([yeniUrun] as ISatisStokHareketleri[]);
  const [isNew] = useState(!props.match.params || !props.match.params.id);
  const [isFisrtPageOpening, setIsFisrtPageOpening] = useState(true);

  const { satisEntity, loading, updating, account } = props;

  const handleClose = () => {
    props.history.push('/satis' + props.location.search);
  };

  const addRow = () => {
    if (stokHareketleriListState[stokHareketleriListState.length - 1].urun.id !== 0)
      setStokHareketleriLists([...stokHareketleriListState, yeniUrun]);
  };

  const onChangeParaUstu = value => {
    setNakit(value);
    setParaUstu(value - satis.toplamTutar);
  };

  const toplamHesapla = stokHareketleriListesi => {
    let toplamTutar = 0;
    for (const stokHareketi of stokHareketleriListesi) {
      if (stokHareketi.tutar != null) toplamTutar += stokHareketi.tutar;
    }
    setSatis({
      ...satis,
      toplamTutar,
    });
    if (nakit && nakit > 0) {
      setParaUstu(nakit - toplamTutar);
    }
  };

  const fixNumber = tutar => {
    if (account.tenantId === 1) {
      return Number((Math.round(tutar * 20) / 20).toFixed(2));
    } else {
      return Number((Math.round(tutar * 4) / 4).toFixed(2));
    }
  };

  useEffect(() => {
    const yeniKdvList = [];
    const copyStokHareketleriListState = cloneDeep(stokHareketleriListState);
    copyStokHareketleriListState.forEach(satisStokHareketi => {
      const urun = satisStokHareketi.urun;
      if (urun.id !== 0) {
        const exist = yeniKdvList.map(a => a.id).includes(urun.kdvKategorisi.id);
        if (!exist) {
          urun.kdvKategorisi.kdvOrani = fixNumber(satisStokHareketi.tutar);
          yeniKdvList.push(urun.kdvKategorisi);
        } else {
          urun.kdvKategorisi.kdvOrani = fixNumber(satisStokHareketi.tutar);
          yeniKdvList.forEach(kdvKategori => {
            if (kdvKategori.id === urun.kdvKategorisi.id) {
              kdvKategori.kdvOrani = urun.kdvKategorisi.kdvOrani + kdvKategori.kdvOrani;
            }
          });
        }
      }
    });
    setKdvKategorisiList(yeniKdvList);
  }, [stokHareketleriListState]);

  const deleteRow = i => {
    const yeniUrunler = [...stokHareketleriListState];
    yeniUrunler.splice(i, 1);
    setStokHareketleriLists(yeniUrunler);
    toplamHesapla(yeniUrunler);
  };

  const indirimHesapla = tutar => {
    if (account.tenantId === 1) {
      return fixNumber(tutar * (100 / 102));
    }
    return tutar;
  };

  const onChangeMiktar = (value, i) => {
    const yeniUrunler = [...stokHareketleriListState];
    if (value > yeniUrunler[i].urun.stok) {
      toast.error('Stoktan daha fazla miktar girdiniz!');
      value = yeniUrunler[i].urun.stok;
    }

    yeniUrunler[i].miktar = value;
    if (yeniUrunler[i].urun.birim === Birim.GRAM) {
      const tutar = value * 0.001 * yeniUrunler[i].urun.musteriFiyati;
      yeniUrunler[i].tutar = fixNumber(tutar);
      if (!isKrediKartli) yeniUrunler[i].tutar = fixNumber(indirimHesapla(yeniUrunler[i].tutar));
    } else {
      const tutar = Number((value * yeniUrunler[i].urun.musteriFiyati).toFixed(2));
      yeniUrunler[i].tutar = fixNumber(tutar);
      if (!isKrediKartli) yeniUrunler[i].tutar = fixNumber(indirimHesapla(yeniUrunler[i].tutar));
    }
    setStokHareketleriLists(yeniUrunler);
    toplamHesapla(yeniUrunler);
  };

  const { satisUrunleri } = props;

  const options = {
    keys: ['urunAdi'],
  };

  const fuse = new Fuse(satisUrunleri, options);

  const fiyatHesapla = satisStokHareketi => {
    if (satisStokHareketi.urun.birim === Birim.GRAM) {
      return fixNumber(satisStokHareketi.urun.musteriFiyati * satisStokHareketi.miktar * 0.001);
    } else {
      return fixNumber(satisStokHareketi.urun.musteriFiyati * satisStokHareketi.miktar);
    }
  };

  const handleKrediKartiKomisyonu = event => {
    const stokHareketleriKomisyonlu = [...stokHareketleriListState];
    if (event.target.value === 'false') {
      setKrediKartli(true);
      stokHareketleriKomisyonlu.forEach(satisStokHareketi => {
        satisStokHareketi.tutar = fiyatHesapla(satisStokHareketi);
      });
    } else {
      setKrediKartli(false);
      stokHareketleriKomisyonlu.forEach(satisStokHareketi => {
        satisStokHareketi.tutar = indirimHesapla(fiyatHesapla(satisStokHareketi));
      });
    }
    setStokHareketleriLists(stokHareketleriKomisyonlu);
    toplamHesapla(stokHareketleriKomisyonlu);
  };

  const searchUrun = value => {
    if (!value.trim().length) {
      return [...satisUrunleri];
    } else {
      return fuse.search(value.trim());
    }
  };

  const onChangeUrun = (e, key) => {
    if (typeof e !== 'string') {
      const yeniUrunler = [...stokHareketleriListState];
      const secilenUrun = e;
      yeniUrunler[key].urun = secilenUrun;
      if (secilenUrun.birim === Birim.GRAM) {
        yeniUrunler[key].miktar = 100;
        yeniUrunler[key].tutar = secilenUrun.musteriFiyati * yeniUrunler[key].miktar * 0.001;
        if (!isKrediKartli) yeniUrunler[key].tutar = indirimHesapla(yeniUrunler[key].tutar);
      } else {
        yeniUrunler[key].miktar = 1;
        yeniUrunler[key].tutar = secilenUrun.musteriFiyati * yeniUrunler[key].miktar;
        if (!isKrediKartli) yeniUrunler[key].tutar = indirimHesapla(yeniUrunler[key].tutar);
      }
      setStokHareketleriLists(yeniUrunler);
      toplamHesapla(yeniUrunler);
      addRow();
    }
  };

  const updateDateSatisField = value => {
    setSatis({
      ...satis,
      ['tarih']: value,
    });
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
    if (isNew && isFisrtPageOpening) {
      setStokHareketleriLists([
        {
          miktar: 0,
          urun: {
            id: 0,
            urunAdi: '',
            musteriFiyati: 0,
          },
        },
      ]);
      setSatis(defaultValueWithNew);
      setIsFisrtPageOpening(false);
    } else if (!isNew && isFisrtPageOpening) {
      setStokHareketleriLists(cloneDeep(satisEntity.stokHareketleriLists));
      const kdvKategorisis = satisEntity.stokHareketleriLists.map(value => value.urun.kdvKategorisi);
      setKdvKategorisiList([...kdvKategorisis]);
    }
  }, [satisEntity.stokHareketleriLists, satisUrunleri]);

  useEffect(() => {
    if (isNew) props.getSatisUrunleri();
    else props.getAllUrunForStokGirisi();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const refreshSatisUrunleri = () => {
    props.getSatisUrunleri();
    setIsFisrtPageOpening(false);
  };

  const saveEntity = (event, errors, values) => {
    if (satis.tarih) {
      values.tarih = convertDateTimeToServer(satis.tarih);
    } else if (satisEntity.tarih) {
      values.tarih = convertDateTimeToServer(satisEntity.tarih);
    } else {
      values.tarih = new Date();
    }

    let toplamTutar = 0;
    const stokHareketleriLists = stokHareketleriListState.filter(stokHareketi => stokHareketi.urun.id !== 0);
    for (const stokHareketi of stokHareketleriLists) {
      if (stokHareketi.urun == null) toplamTutar += stokHareketi.tutar;
    }
    toplamTutar = fixNumber(toplamTutar);

    if (errors.length === 0) {
      if (isNew) {
        const yenisatis = {
          ...satis,
          satisEntity,
          stokHareketleriLists,
          toplamTutar,
          ...values,
        };
        props.createEntity(yenisatis);
      } else {
        let yenisatis = {
          ...satisEntity,
        };
        yenisatis = {
          ...yenisatis,
          stokHareketleriLists,
          toplamTutar,
          ...values,
        };
        props.updateEntity(yenisatis);
      }
    }
  };

  const filterOptions = (optionss, { inputValue }) => searchUrun(inputValue);

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          {isNew ? (
            <h2 id="koopApp.satis.home.createOrEditLabel" className="d-none d-md-inline">
              <Translate contentKey="koopApp.satis.home.createOrEditLabel">Create or edit a Satis</Translate>
            </h2>
          ) : (
            <h2 id="koopApp.satis.home.createOrEditLabel" className="d-md-inline">
              <div className="alert alert-warning">Satış düzenlemesi yapıyorsunuz. Kasada fark çıkabilir, dikkatli olun!!!</div>
            </h2>
          )}
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="10" className="satis-font">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : satisEntity} onSubmit={saveEntity}>
              <Button tag={Link} onClick={addRow} color="primary" size="sm">
                <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Yeni Ürün Ekle</span>
              </Button>
              {stokHareketleriListState && stokHareketleriListState.length > 0 ? (
                <div>
                  {stokHareketleriListState.map((stokHareketi, i) => (
                    <div key={`entity-${i}`} className="urun-sinir">
                      <AvGroup>
                        <Col style={{ padding: '0' }}>
                          <Row className="g-2">
                            <Col className="col-1" style={{ marginTop: '10px', padding: '15, 0, 0, 0' }}>
                              <Button onClick={refreshSatisUrunleri} color={'btn btn-primary'}>
                                <FontAwesomeIcon icon="sync" />
                              </Button>
                            </Col>
                            <Col className="col-md-5 col-12" style={{ marginTop: '10px', padding: '0px' }}>
                              <Autocomplete
                                options={satisUrunleri}
                                freeSolo
                                value={stokHareketi.urun}
                                getOptionLabel={option => option.urunAdi}
                                onChange={(event, newValue) => {
                                  onChangeUrun(newValue, i);
                                }}
                                filterOptions={filterOptions}
                                renderInput={params => <TextField {...params} variant="outlined" fullWidth />}
                              />
                            </Col>
                            <Col style={{ marginTop: '10px', padding: '0px' }}>
                              <Col>Kalan Stok</Col>
                              <Col>
                                {stokHareketi.urun.stok} {stokHareketi.urun.birim}
                              </Col>
                            </Col>
                            <Col style={{ marginTop: '10px', padding: '0px' }} className="col-md col-6">
                              <Col>
                                <Translate contentKey="koopApp.satisStokHareketleri.miktar">Miktar</Translate>
                              </Col>
                              <Col>
                                <input
                                  className="col-md-12"
                                  style={{ width: '80px' }}
                                  value={stokHareketi.miktar}
                                  onChange={e => onChangeMiktar(e.target.value, i)}
                                />
                              </Col>
                            </Col>
                            <Col style={{ marginTop: '10px', padding: '0px' }}>
                              <Col>Birim Fiyat</Col>
                              <Col>{stokHareketi.urun.musteriFiyati} TL</Col>
                            </Col>
                            <Col style={{ marginTop: '10px', padding: '0px' }}>
                              <Col>
                                <Translate contentKey="koopApp.satisStokHareketleri.tutar">Tutar</Translate>
                              </Col>
                              <Col>{stokHareketi.tutar} TL</Col>
                            </Col>
                            <Col style={{ marginTop: '10px', padding: '0px' }}>
                              <div className="btn-group flex-btn-group-container">
                                <Button tag={Link} color="danger" size="sm" onClick={() => deleteRow(i)}>
                                  <FontAwesomeIcon icon="trash" /> <span className="d-none d-md-inline" />
                                </Button>
                              </div>
                            </Col>
                          </Row>
                        </Col>
                      </AvGroup>
                    </div>
                  ))}
                  <AvGroup style={{ marginTop: '20px' }}>
                    <Label for="satis-toplamTutar">
                      <Translate contentKey="koopApp.satis.toplamTutar" />
                    </Label>
                    <AvInput
                      id="satis-toplamTutar"
                      type="text"
                      value={satis.toplamTutar}
                      className="form-control"
                      name="toplamTutar"
                      disabled
                      readOnly
                    />
                  </AvGroup>
                  <AvGroup>
                    <Label for="satis-nakitTutar">Nakit Verilen</Label>
                    <input style={{ marginLeft: '10px' }} className="col-sm-2" onChange={e => onChangeParaUstu(Number(e.target.value))} />
                  </AvGroup>
                  <AvGroup>
                    <Label for="satis-paraustu">Para Üstü</Label>
                    <input style={{ marginLeft: '10px' }} className="col-sm-2" value={paraUstu} />
                  </AvGroup>
                  <AvGroup>
                    <Label for="gider-user">Satış Tarihi</Label>
                    <Calendar
                      id="time24"
                      style={{ marginLeft: '10px' }}
                      value={new Date()}
                      dateFormat="dd/mm/yy"
                      onChange={e => updateDateSatisField(e.value)}
                      showTime
                      showSeconds
                    />
                  </AvGroup>
                  <AvGroup check>
                    <Label id="kartliSatisLabel">
                      <AvInput
                        id="satis-kartliSatis"
                        type="checkbox"
                        onChange={handleKrediKartiKomisyonu}
                        className="form-check-input"
                        name="kartliSatis"
                      />
                      <Translate contentKey="koopApp.satis.kartliSatis">Kartli Satis</Translate>
                    </Label>
                  </AvGroup>
                  <AvGroup check>
                    <Label id="ortagaSatisLabel">
                      <AvInput id="satis-ortagaSatis" type="checkbox" className="form-check-input" name="ortagaSatis" />
                      <Translate contentKey="koopApp.satis.ortagaSatis">Ortaga Satis</Translate>
                    </Label>
                  </AvGroup>
                </div>
              ) : (
                <div className="alert alert-warning" />
              )}
              <div className="table-responsive">
                {kdvKategorisiList && kdvKategorisiList.length > 0 ? (
                  <Table responsive>
                    <thead>
                      <tr>
                        <th className="hand">
                          <Translate contentKey="koopApp.kdvKategorisi.kategoriAdi">Kategori Adi</Translate>
                          <FontAwesomeIcon icon="sort" />
                        </th>
                        <th className="hand">
                          <Translate contentKey="koopApp.kdvKategorisi.kdvOrani">Kdv Orani</Translate>
                        </th>
                        <th />
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
                  <div className="alert alert-warning" />
                )}
              </div>
              {!isNew ? (
                <AvGroup>
                  <Label for="satis-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="satis-id" type="text" className="form-control" name="id" required readOnly on />
                </AvGroup>
              ) : null}
              <Button tag={Link} id="cancel-save" to="/satis" replace color="info">
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
  satisEntity: storeState.satis.entity,
  loading: storeState.satis.loading,
  updating: storeState.satis.updating,
  updateSuccess: storeState.satis.updateSuccess,
  satisUrunleri: storeState.urun.satisUrunleri,
  account: storeState.authentication.account,
});

const mapDispatchToProps = {
  getUsers,
  getEntity,
  updateEntity,
  createEntity,
  reset,
  getSatisUrunleri,
  createStokHareketi,
  updateStokHareketi,
  getAllUrunForStokGirisi,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(SatisUpdate);
