import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Label, Row, Table } from 'reactstrap';
import { AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';
import { Translate, ICrudGetAllAction, getSortState, IPaginationBaseState, JhiPagination, JhiItemCount } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './urun-fiyat-hesap.reducer';
import { IUrunFiyatHesap } from 'app/shared/model/urun-fiyat-hesap.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { getAllUrunForStokGirisi } from 'app/entities/urun/urun.reducer';
import TextField from '@material-ui/core/TextField';
import { toast } from 'react-toastify';
import cloneDeep from 'lodash/cloneDeep';
import { Calendar } from 'primereact/calendar';
import 'primeflex/primeflex.css';
import Fuse from 'fuse.js';
import { Autocomplete } from '@material-ui/lab';
import { defaultValue as satisDefault, defaultValueWithNew } from 'app/shared/model/satis.model';
import { ISatisStokHareketleri } from 'app/shared/model/satis-stok-hareketleri.model';
import { Birim } from 'app/shared/model/enumerations/birim.model';
import { convertDateTimeToServer } from 'app/shared/util/date-utils';

export interface IFiyatHesapProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const FiyatHesap = (props: IFiyatHesapProps) => {
  const [satis, setSatis] = useState(satisDefault);
  const yeniUrun = {
    miktar: 0,
    urun: {
      id: 0,
      urunAdi: '',
      musteriFiyati: 0,
    },
  };
  const [stokHareketleriListState, setStokHareketleriLists] = useState([yeniUrun] as ISatisStokHareketleri[]);
  const [isFisrtPageOpening, setIsFisrtPageOpening] = useState(true);

  const handleClose = () => {
    props.history.push('/urun-fiyat-hesap' + props.location.search);
  };

  const addRow = () => {
    if (stokHareketleriListState[stokHareketleriListState.length - 1].urun.id !== 0)
      setStokHareketleriLists([...stokHareketleriListState, yeniUrun]);
  };

  const fixNumber = tutar => {
    return Number((Math.round(tutar * 4) / 4).toFixed(2));
  };

  const toplamHesapla = stokHareketleriListesi => {
    let toplamTutar = 0;
    for (const stokHareketi of stokHareketleriListesi) {
      if (stokHareketi.tutar != null) {
        toplamTutar = toplamTutar + stokHareketi.tutar;
      }
    }
    // fix number due to javascript numbers
    toplamTutar = fixNumber(toplamTutar);

    setSatis({
      ...satis,
      toplamTutar,
    });
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
  }, [stokHareketleriListState]);

  const deleteRow = i => {
    const yeniUrunler = [...stokHareketleriListState];
    yeniUrunler.splice(i, 1);
    setStokHareketleriLists(yeniUrunler);
    toplamHesapla(yeniUrunler);
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
    } else {
      const tutar = Number((value * yeniUrunler[i].urun.musteriFiyati).toFixed(2));
      yeniUrunler[i].tutar = fixNumber(tutar);
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

  const searchUrun = value => {
    if (!value.trim().length) {
      return [...satisUrunleri];
    } else {
      return fuse.search(value.trim());
    }
  };

  const filterOptions = (optionss, { inputValue }) => searchUrun(inputValue);

  const onChangeUrun = (e, key) => {
    if (typeof e !== 'string') {
      const yeniUrunler = [...stokHareketleriListState];
      const secilenUrun = e;
      yeniUrunler[key].urun = secilenUrun;
      if (secilenUrun.birim === Birim.GRAM) {
        yeniUrunler[key].miktar = 100;
        yeniUrunler[key].tutar = fixNumber(secilenUrun.musteriFiyati * yeniUrunler[key].miktar * 0.001);
      } else {
        yeniUrunler[key].miktar = 1;
        yeniUrunler[key].tutar = fixNumber(secilenUrun.musteriFiyati * yeniUrunler[key].miktar);
      }
      setStokHareketleriLists(yeniUrunler);
      toplamHesapla(yeniUrunler);
      addRow();
    }
  };

  useEffect(() => {
    if (isFisrtPageOpening) {
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
    } else if (isFisrtPageOpening) {
      setStokHareketleriLists(cloneDeep(satisEntity.stokHareketleriLists));
    }
  }, [satisEntity.stokHareketleriLists, satisUrunleri]);

  useEffect(() => {
    props.getAllUrunForStokGirisi();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    let toplamTutar = 0;
    const stokHareketleriLists = stokHareketleriListState.filter(stokHareketi => stokHareketi.urun.id !== 0);
    for (const stokHareketi of stokHareketleriLists) {
      if (stokHareketi.urun == null) toplamTutar += stokHareketi.tutar;
    }
    toplamTutar = fixNumber(toplamTutar);

    if (errors.length === 0) {
      const yenisatis = {
        ...satis,
        satisEntity,
        stokHareketleriLists,
        toplamTutar,
        ...values,
      };
      props.createEntity(yenisatis);
    }
  };

  return (
    <div>
      <h2 id="urun-fiyat-hesap-heading">
        <Button color="primary" id="save-entity" type="submit">
          Kaydet
        </Button>
      </h2>
      <Row className="justify-content-center">
        <Col md="10" className="satis-font">
          <AvForm model={satis} onSubmit={saveEntity}>
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
              </div>
            ) : (
              <div className="alert alert-warning" />
            )}
            <Button tag={Link} id="cancel-save" to="/urun-fiyat-hesap" replace color="info">
              <FontAwesomeIcon icon="arrow-left" />
              &nbsp;
              <span className="d-none d-md-inline">
                <Translate contentKey="entity.action.back">Back</Translate>
              </span>
            </Button>
            &nbsp;
            <Button color="primary" id="save-entity" type="submit">
              <FontAwesomeIcon icon="save" />
              &nbsp;
              <Translate contentKey="entity.action.save">Save</Translate>
            </Button>
          </AvForm>
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  fiyatHesapList: storeState.urunFiyatHesap.entities,
  loading: storeState.urunFiyatHesap.loading,
  totalItems: storeState.urunFiyatHesap.totalItems,
  satisUrunleri: storeState.urun.satisUrunleri,
  updateSuccess: storeState.urunFiyatHesap.updateSuccess,
});

const mapDispatchToProps = {
  getEntities,
  getAllUrunForStokGirisi,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(FiyatHesap);
