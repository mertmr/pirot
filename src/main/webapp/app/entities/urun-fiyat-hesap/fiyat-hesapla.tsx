import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, RouteComponentProps } from "react-router-dom";
import { Button, Col, Label, Row, Table } from "reactstrap";
import { AvForm, AvGroup, AvInput } from "availity-reactstrap-validation";
import { TextFormat, Translate } from "react-jhipster";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { IRootState } from "app/shared/reducers";
import { getEntities } from "./urun-fiyat-hesap.reducer";
import { getAllUrunForStokGirisi } from "app/entities/urun/urun.reducer";
import TextField from "@material-ui/core/TextField";
import cloneDeep from "lodash/cloneDeep";
import "primeflex/primeflex.css";
import Fuse from "fuse.js";
import { Autocomplete } from "@material-ui/lab";
import { defaultValue as satisDefault, defaultValueWithNew } from "app/shared/model/satis.model";
import { ISatisStokHareketleri } from "app/shared/model/satis-stok-hareketleri.model";
import { Birim } from "app/shared/model/enumerations/birim.model";
import { createEntity } from "app/entities/satis/satis.reducer";
import { APP_DATE_FORMAT } from "app/config/constants";

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
    yeniUrunler[i].agirlikAta = value;
    yeniUrunler[i].miktar = value;
    setStokHareketleriLists(yeniUrunler);
  };

  const onChangeBirimFiyat = (value, i) => {
    const yeniUrunler = [...stokHareketleriListState];
    yeniUrunler[i].tutar = value;
    setStokHareketleriLists(yeniUrunler);
  };

  const onChangeAgirlikAta = (value, i) => {
    const yeniUrunler = [...stokHareketleriListState];
    yeniUrunler[i].agirlikAta = value;
    setStokHareketleriLists(yeniUrunler);
  };

  const { satisUrunleri } = props;

  const options = {
    keys: ['urunAdi'],
  };

  const fuse = new Fuse(satisUrunleri, options);

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
  }, [satisUrunleri]);

  useEffect(() => {
    props.getAllUrunForStokGirisi();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const fiyatHesapla = (event, errors, values) => {
    setIsFisrtPageOpening(false);
  };

  const saveEntity = (event, errors, values) => {
    let toplamTutar = 0;
    const stokHareketleriLists = stokHareketleriListState.filter(stokHareketi => stokHareketi.urun.id !== 0);
    for (const stokHareketi of stokHareketleriLists) {
      if (stokHareketi.urun == null) toplamTutar += stokHareketi.tutar;
    }

    if (errors.length === 0) {
      const yenisatis = {
        ...satis,
        stokHareketleriLists,
        ...values,
      };
      props.createEntity(yenisatis);
    }
  };

  const { fiyatList } = props;
  return (
    <div>
      <h2 id="urun-fiyat-hesap-heading">
        <Button color="primary" id="save-entity" type="submit">
          Kaydet
        </Button>
      </h2>
      <Row className="justify-content-center">
        <Col md="10" className="satis-font">
          <AvForm model={satis} onSubmit={fiyatHesapla}>
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
                              style={{ marginLeft: '20px', width: '80%'}}
                              value={stokHareketi.urun}
                              getOptionLabel={option => option.urunAdi}
                              onChange={(event, newValue) => {
                                onChangeUrun(newValue, i);
                              }}
                              filterOptions={filterOptions}
                              renderInput={params => <TextField {...params} variant="outlined" fullWidth />}
                            />
                          </Col>
                          <Col style={{ marginTop: '10px', padding: '0px' }} className="col-md col-6">
                            <Col>
                              <Translate contentKey="koopApp.satisStokHareketleri.miktar">Miktar</Translate>
                            </Col>
                            <Col>
                              <input
                                className="col-md-12"
                                style={{ width: '80%' }}
                                value={stokHareketi.miktar}
                                onChange={e => onChangeMiktar(e.target.value, i)}
                              />
                            </Col>
                          </Col>
                          <Col style={{ marginTop: '10px', padding: '0px'}} className="col-md col-6">
                            <Col>
                              Birim Fiyat
                            </Col>
                            <Col>
                              <input
                                className="col-md-12"
                                style={{ width: '80%' }}
                                value={stokHareketi.tutar}
                                onChange={e => onChangeBirimFiyat(e.target.value, i)}
                              />
                            </Col>
                          </Col>
                          <Col style={{ marginTop: '10px', padding: '0px'}} className="col-md col-6">
                            <Col>
                              Ağırlık Ata
                            </Col>
                            <Col>
                              <input
                                className="col-md-12"
                                style={{ width: '80%' }}
                                value={stokHareketi.agirlikAta}
                                onChange={e => onChangeAgirlikAta(e.target.value, i)}
                              />
                            </Col>
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
              </div>
            ) : (
              <div className="alert alert-warning" />
            )}
            <Button color="primary" id="save-entity">
              <FontAwesomeIcon icon="save" />
              &nbsp;
              Fiyat Hesapla
            </Button>
          </AvForm>
          <AvForm model={satis} onSubmit={saveEntity}>
            {isFisrtPageOpening ? (
              <div className="table-responsive">
                {fiyatList && fiyatList.length > 0 ? (
                  <Table responsive>
                    <thead>
                    <tr>
                      <th className="hand">Ürün ID</th>
                      <th className="hand">Ürün Adı</th>
                      <th className="hand">Eski Fiyat</th>
                      <th className="hand">Yeni Fiyat</th>
                    </tr>
                    </thead>
                    <tbody>
                    {fiyatList.map((fiyat, i) => (
                      <tr key={`entity-${i}`}>
                        <td>{fiyat.urunId}</td>
                        <td>{fiyat.urunAdi}</td>
                        <td>{fiyat.eskiFiyat}</td>
                        <td>{fiyat.yeniFiyat}</td>
                      </tr>
                    ))}
                    </tbody>
                  </Table>
                ) : (
                   (
                    <div className="alert alert-warning">
                      <Translate contentKey="koopApp.fiyat.home.notFound">Fiyat hesabı bulunamadı</Translate>
                    </div>
                  )
                )}
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
  fiyatList: storeState.urunFiyatHesap.fiyatList,
  loading: storeState.urunFiyatHesap.loading,
  totalItems: storeState.urunFiyatHesap.totalItems,
  satisUrunleri: storeState.urun.satisUrunleri,
  updateSuccess: storeState.urunFiyatHesap.updateSuccess,
});

const mapDispatchToProps = {
  getEntities,
  getAllUrunForStokGirisi,
  createEntity,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(FiyatHesap);
