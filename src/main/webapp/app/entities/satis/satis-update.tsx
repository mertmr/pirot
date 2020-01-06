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
import {convertDateTimeFromServer, convertDateTimeToServer} from 'app/shared/util/date-utils';
import {defaultValue} from "app/shared/model/urun.model";
import {defaultValue as satisDefault, ISatis} from "app/shared/model/satis.model";
import {
  defaultValue as stokHareketiDefault,
  ISatisStokHareketleri
} from "app/shared/model/satis-stok-hareketleri.model";
import {DatePicker, InputNumber, Select} from 'antd';
import 'antd/lib/input-number/style/index.css';
import 'antd/lib/date-picker/style/index.css';
import 'antd/lib/select/style/index.css';
import 'antd/lib/input/style/index.css';
import {getSatisUrunleri} from "app/entities/urun/urun.reducer";
import moment from 'moment';
import 'moment/locale/tr';
import {APP_LOCAL_DATETIME_FORMAT} from "app/config/constants";

export interface ISatisUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {
}

export const SatisUpdate = (props: ISatisUpdateProps) => {
  const [userId, setUserId] = useState('0');
  const [satis, setSatis] = useState(satisDefault);
  const [satisStokHareketleri, setSatisStokHareketleri] = useState([] as ReadonlyArray<ISatisStokHareketleri>);
  const [urunler, setUrunler] = useState([{
    index: 0,
    miktar: undefined,
    birimFiyat: undefined,
    urun: defaultValue,
    tutar: 0
  }
  ]);
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const {satisEntity, users, loading, updating} = props;

  const handleClose = () => {
    props.history.push('/satis' + props.location.search);
  };

  const addRow = () => {
    const yeniUrun = {
      index: urunler.length,
      miktar: undefined,
      birimFiyat: undefined,
      urun: defaultValue,
      tutar: 0
    };
    setUrunler([...urunler, yeniUrun]);
  };

  const deleteRow = (i) => {
    const yeniUrunler = [...urunler];
    yeniUrunler.splice(i, 1);
    setUrunler(yeniUrunler);
  };

  const onChangeMiktar = (value, i) => {
    const yeniUrunler = [...urunler];
    yeniUrunler[i].miktar = value;
    yeniUrunler[i].tutar = value * yeniUrunler[i].birimFiyat;
    setUrunler(yeniUrunler);
  };

  const {satisUrunleri} = props;

  const onChangeUrun = (value, i) => {
    const yeniUrunler = [...urunler];
    const secilenUrun = satisUrunleri[value];
    yeniUrunler[i].birimFiyat = secilenUrun.musteriFiyati;
    yeniUrunler[i].urun = secilenUrun;
    setUrunler(yeniUrunler);
  };

  const updateDateSatisField = (value, dateString) => {
    setSatis({
      ...satis,
      ["tarih"]: dateString
    });
  };

  const updateSatisField = (e) => {
    setSatis({
      ...satis,
      [e.target.name]: e.target.value
    });
  };

  const {Option} = Select;

  useEffect(() => {
    props.getSatisUrunleri();
  }, []);

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getUsers();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    values.tarih = convertDateTimeToServer(satis.tarih);

    if (errors.length === 0) {
      const entity = {
        ...satisEntity,
        ...satis.tarih
      };

      setSatisStokHareketleri([...satisStokHareketleri, urunler]);

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
              {!isNew ? (
                <AvGroup>
                  <Label for="satis-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="satis-id" type="text" className="form-control" name="id" required readOnly/>
                </AvGroup>
              ) : null}
              <Row>
                <DatePicker showTime
                            name="tarih"
                            placeholder="Tarih Seçin"
                            onChange={updateDateSatisField}
                            defaultValue={isNew ? moment(new Date(), 'YYYY-MM-DD') :
                              moment(convertDateTimeFromServer(props.satisEntity.tarih), APP_LOCAL_DATETIME_FORMAT)}/>
              </Row>
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
                {urunler && urunler.length > 0 ? (
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
                        <Translate contentKey="koopApp.satisStokHareketleri.miktar">Miktar</Translate>
                      </th>
                      <th className="hand">
                        <Translate contentKey="koopApp.satisStokHareketleri.tutar">Tutar</Translate>
                      </th>
                      <th/>
                    </tr>
                    </thead>
                    <tbody>
                    {urunler.map((urun, i) => (
                      <tr key={`entity-${i}`}>
                        <td>
                          <Select
                            showSearch
                            style={{width: 400}}
                            placeholder="Ürün seç"
                            optionFilterProp="children"
                            onChange={(value) => onChangeUrun(value, i)}
                          >
                            {satisUrunleri.map((satisUrunu, k) => (
                              <Option key={k} value={k}>{satisUrunu.urunAdi}</Option>
                            ))}
                          </Select>
                        </td>
                        <td>{urun.birimFiyat} TL</td>
                        <td><InputNumber value={urun.miktar} onChange={(value) => onChangeMiktar(value, i)}/></td>
                        <td>{urun.tutar} TL</td>
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
                  </Table>
                ) : (
                  <div className="alert alert-warning">
                    <Translate contentKey="koopApp.satisStokHareketleri.home.notFound">No Satis Stok Hareketleris
                      found</Translate>
                  </div>
                )}
              </div>
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
  satisUrunleri: storeState.urun.entities
});

const mapDispatchToProps = {
  getUsers,
  getEntity,
  updateEntity,
  createEntity,
  reset,
  getSatisUrunleri
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(SatisUpdate);
