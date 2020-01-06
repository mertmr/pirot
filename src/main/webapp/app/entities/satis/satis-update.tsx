import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {Link, RouteComponentProps} from 'react-router-dom';
import {Button, Col, Label, Row, Table} from 'reactstrap';
import {AvForm, AvGroup, AvInput} from 'availity-reactstrap-validation';
import {Translate} from 'react-jhipster';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {IRootState} from 'app/shared/reducers';
import {getUsers} from 'app/modules/administration/user-management/user-management.reducer';
import {createEntity, getEntity, getSatisUrunleri, reset, updateEntity} from './satis.reducer';
import {convertDateTimeFromServer, convertDateTimeToServer} from 'app/shared/util/date-utils';
import {defaultValue} from "app/shared/model/urun.model";
import {InputNumber, Select} from 'antd';
import 'antd/lib/input-number/style/index.css';
import 'antd/lib/select/style/index.css';


export interface ISatisUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {
}

export const SatisUpdate = (props: ISatisUpdateProps) => {
  const [userId, setUserId] = useState('0');
  const [urunler, setUrunler] = useState([{
    id: 0,
    miktar: undefined,
    tutar: undefined,
    urun: defaultValue,
    urunToplamTutari: 0
  }
  ]);
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const {satisEntity, users, loading, updating} = props;

  const handleClose = () => {
    props.history.push('/satis' + props.location.search);
  };

  const addRow = () => {
    const yeniUrun = {
      id: urunler.length,
      miktar: undefined,
      tutar: undefined,
      urun: defaultValue,
      urunToplamTutari: 0
    };
    setUrunler([...urunler, yeniUrun]);
  };

  const onChangeMiktar = (value, i) => {
    const yeniUrun = [...urunler];
    yeniUrun[i].miktar = value;
    setUrunler(yeniUrun);
  };

  const { Option } = Select;

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
    values.tarih = convertDateTimeToServer(values.tarih);

    if (errors.length === 0) {
      const entity = {
        ...satisEntity,
        ...values
      };

      if (isNew) {
        props.createEntity(entity);
      } else {
        props.updateEntity(entity);
      }
    }
  };

  const { satisUrunleri } = props;

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
              <AvGroup>
                <Label id="tarihLabel" for="satis-tarih">
                  <Translate contentKey="koopApp.satis.tarih">Tarih</Translate>
                </Label>
                <AvInput
                  id="satis-tarih"
                  type="datetime-local"
                  className="form-control"
                  name="tarih"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? null : convertDateTimeFromServer(props.satisEntity.tarih)}
                />
              </AvGroup>
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
                          {/*<Select*/}
                          {/*  showSearch*/}
                          {/*  style={{ width: 200 }}*/}
                          {/*  placeholder="Select a person"*/}
                          {/*  optionFilterProp="children"*/}
                          {/*  filterOption={(input, option) =>*/}
                          {/*    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0*/}
                          {/*  }*/}
                          {/*>*/}
                          {/*  {satisUrunleri.map((satisUrunu, k) => (*/}
                          {/*  <Option key={k} value="k">satisUrunu.urunAdi</Option>*/}
                          {/*    ))}*/}
                          {/*</Select>*/}
                        </td>
                        <td>{urun.tutar} TL</td>
                        <td><InputNumber value={urun.miktar} onChange={(value) => onChangeMiktar(value, i)}/></td>
                        <td>{urun.urunToplamTutari} TL</td>
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
  satisUrunleri:  storeState.satis.satisUrunleri
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
