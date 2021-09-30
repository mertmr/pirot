import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, RouteComponentProps } from "react-router-dom";
import { Button, Col, Label, Row, Table, Badge, UncontrolledTooltip } from "reactstrap";
import { AvForm, AvGroup, AvInput } from "availity-reactstrap-validation";
import { Translate } from "react-jhipster";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { IRootState } from "app/shared/reducers";
import { getEntities, updateFiyat } from "./urun-fiyat-hesap.reducer";
import TextField from "@material-ui/core/TextField";
import cloneDeep from "lodash/cloneDeep";
import "primeflex/primeflex.css";
import Fuse from "fuse.js";
import { Autocomplete } from "@material-ui/lab";
import { defaultValue as satisDefault, defaultValueWithNew } from "app/shared/model/satis.model";
import { defaultValueList, IFiyat } from "app/shared/model/fiyat.model";
import { ISatisStokHareketleri } from "app/shared/model/satis-stok-hareketleri.model";
import { Birim } from "app/shared/model/enumerations/birim.model";
import { createEntity } from "app/entities/satis/satis.reducer";
import { FATURA_TIPI } from "app/shared/model/enumerations/fatura-tipi.model";
import { IFiyatDTO } from "app/shared/model/fiyat-list.model";

export interface IFiyatHesapProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const FiyatHesap = (props: IFiyatHesapProps) => {
  const [satis, setSatis] = useState(satisDefault);
  const [kargo, setKargo] = useState(0);
  const [fiyatList, setFiyatList] = useState(defaultValueList);
  const [fiyatHesapDTOList, setFiyatHesapDTOList] = useState(defaultValueList);
  const [satisUrunleri, setSatisUrunleri] = useState([]);
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
  const [fiyatHesaplamaString, setFiyatHesaplamaString] = useState('');
  const [yeniFiyat, setYeniFiyat] = useState(0);

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
      } else {
        yeniUrunler[key].miktar = 1;
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
    props.getEntities();
  }, []);

  const { urunFiyatHesapList } = props;

  useEffect(() => {
    const urunArray = [];
    urunFiyatHesapList.forEach(function (urunFiyatHesap) {
      // let urunFiyatHesapModel = {} as IUrun;
      urunFiyatHesap.urun.urunFiyatHesap = urunFiyatHesap;
      urunArray.push(urunFiyatHesap.urun);
    });
    setSatisUrunleri(urunArray);
  }, [urunFiyatHesapList]);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = () => {
    const fiyatListWrapper = {} as IFiyatDTO;
    fiyatListWrapper.fiyatHesapDTOList = fiyatList;
    props.updateFiyat(fiyatListWrapper);
  };

  const fiyatHesapla = () => {
    let toplamKargoAgirligi = 0;
    stokHareketleriListState.forEach(function (stokGirisi) {
      if (stokGirisi.urun.id !== 0) {
        toplamKargoAgirligi = toplamKargoAgirligi + Number(stokGirisi.agirlikAta);
      }
    });
    const fiyats = [];
    stokHareketleriListState.forEach(function (stokGirisi) {
      if (stokGirisi.urun.id !== 0) {
        const urunFiyatHesap = stokGirisi.urun.urunFiyatHesap;
        let kdvDahilBirimFiyat;
        if(urunFiyatHesap.faturaTipi === FATURA_TIPI.FATURA) {
          kdvDahilBirimFiyat = stokGirisi.tutar * (1 + 0.01 * stokGirisi.urun.kdvKategorisi.kdvOrani);
        } else {
          kdvDahilBirimFiyat = stokGirisi.tutar;
        }
        if(stokGirisi.urun.birim === Birim.ADET)
          kdvDahilBirimFiyat = Number(kdvDahilBirimFiyat) + Number((((stokGirisi.agirlikAta / toplamKargoAgirligi) * kargo) / stokGirisi.miktar));
        else
          kdvDahilBirimFiyat = Number(kdvDahilBirimFiyat) + Number(((stokGirisi.agirlikAta / toplamKargoAgirligi) * kargo) / (stokGirisi.miktar * 0.001));

        const koopPayi = urunFiyatHesap.amortisman +
          urunFiyatHesap.dayanisma +
          urunFiyatHesap.dukkanGider +
          urunFiyatHesap.fire +
          urunFiyatHesap.giderPusulaMustahsil +
          urunFiyatHesap.kooperatifCalisma;
        let koopFiyati = kdvDahilBirimFiyat * (1 + 0.01 * koopPayi);
        koopFiyati = Number((Math.round(koopFiyati * 4) / 4).toFixed(2));
        const fiyatModel = {} as IFiyat;
        fiyatModel.urunId = stokGirisi.urun.id;
        fiyatModel.urunAdi = stokGirisi.urun.urunAdi;
        fiyatModel.eskiFiyat = stokGirisi.urun.musteriFiyati;
        fiyatModel.yeniFiyat = koopFiyati;
        fiyats.push(fiyatModel);
      }
    });
    setFiyatList(fiyats);
  };

  const clearTable = () => {
    setFiyatList([]);
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
                              style={{ marginLeft: '20px', width: '80%' }}
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
                          <Col style={{ marginTop: '10px', padding: '0px' }} className="col-md col-6">
                            <Col>Birim Fiyat</Col>
                            <Col>
                              <input
                                className="col-md-12"
                                style={{ width: '80%' }}
                                value={stokHareketi.tutar}
                                onChange={e => onChangeBirimFiyat(e.target.value, i)}
                              />
                            </Col>
                          </Col>
                          <Col style={{ marginTop: '10px', padding: '0px' }} className="col-md col-6">
                            <Col>Ağırlık Ata</Col>
                            <Col>
                              <input
                                className="col-md-12"
                                style={{ width: '80%' }}
                                value={stokHareketi.agirlikAta}
                                onChange={e => onChangeAgirlikAta(e.target.value, i)}
                              />
                            </Col>
                          </Col>
                          <Col style={{ marginTop: '10px', padding: '0px' }} className="col-md col-6">
                            <Badge id="stok-siniri-info" style={{ marginLeft: '5px' }} color="info">
                              Bilgi
                            </Badge>
                            <UncontrolledTooltip placement={'right'} target={'stok-siniri-info'}>
                              Ağırlık ata alanını manuel doldurmanız gereken tek zaman aynı faturada hem adetli hem de
                              gramajlı ürün geldiği zamandır. Bu durumda mesela 10 tane maske, 10 kg da limon geldiyse tüm ürünlerin
                              gramajını bu alana girerek fiyat hesaplamasını otomatik hale getirebilirsiniz. Mesela 10 kg limon
                              için limon ağırlık kısmına 10000, 10 maske için de mesela bir maske 10 gr ise toplamda 100 gr diyebilirsiniz.
                            </UncontrolledTooltip>
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
            <AvGroup style={{ marginTop: '20px' }}>
              <Label for="kargo">Kargo</Label>
              <AvInput id="kargo_input" type="number" className="form-control" name="kargo" onChange={e => setKargo(e.target.value)} />
            </AvGroup>
            <Button color="primary" id="save-entity">
              <FontAwesomeIcon icon="save" />
              &nbsp; Fiyat Hesapla
            </Button>
            <Button color="primary" onClick={() => clearTable()}>
              Temizle
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
                  <div className="alert alert-warning">
                   Fiyat hesabı bulunamadı
                  </div>
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
  urunFiyatHesapList: storeState.urunFiyatHesap.entities,
  loading: storeState.urunFiyatHesap.loading,
  totalItems: storeState.urunFiyatHesap.totalItems,
  updateSuccess: storeState.urunFiyatHesap.updateSuccess,
});

const mapDispatchToProps = {
  getEntities,
  createEntity,
  updateFiyat,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(FiyatHesap);
