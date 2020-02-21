import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IUser } from 'app/shared/model/user.model';
import { getUsers } from 'app/modules/administration/user-management/user-management.reducer';
import { IUrun } from 'app/shared/model/urun.model';
import { getEntities as getUruns } from 'app/entities/urun/urun.reducer';
import { getEntity, updateEntity, createEntity, reset } from './stok-girisi.reducer';
import { IStokGirisi } from 'app/shared/model/stok-girisi.model';
import { convertDateTimeFromServer, convertDateTimeToServer } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IStokGirisiUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const StokGirisiUpdate = (props: IStokGirisiUpdateProps) => {
  const [userId, setUserId] = useState('0');
  const [urunId, setUrunId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { stokGirisiEntity, users, uruns, loading, updating } = props;

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
    props.getUruns();
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
        ...values
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
                  <AvInput id="stok-girisi-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="miktarLabel" for="stok-girisi-miktar">
                  <Translate contentKey="koopApp.stokGirisi.miktar">Miktar</Translate>
                </Label>
                <AvField
                  id="stok-girisi-miktar"
                  type="string"
                  className="form-control"
                  name="miktar"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                    number: { value: true, errorMessage: translate('entity.validation.number') }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="agirlikLabel" for="stok-girisi-agirlik">
                  <Translate contentKey="koopApp.stokGirisi.agirlik">Agirlik</Translate>
                </Label>
                <AvField id="stok-girisi-agirlik" type="string" className="form-control" name="agirlik" />
              </AvGroup>
              <AvGroup>
                <Label id="notlarLabel" for="stok-girisi-notlar">
                  <Translate contentKey="koopApp.stokGirisi.notlar">Notlar</Translate>
                </Label>
                <AvField
                  id="stok-girisi-notlar"
                  type="text"
                  name="notlar"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') }
                  }}
                />
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
                  value={(!isNew && stokGirisiEntity.stokHareketiTipi) || 'YOK'}
                >
                  <option value="YOK">{translate('koopApp.StokHareketiTipi.YOK')}</option>
                  <option value="STOK_GIRISI">{translate('koopApp.StokHareketiTipi.STOK_GIRISI')}</option>
                  <option value="FIRE">{translate('koopApp.StokHareketiTipi.FIRE')}</option>
                  <option value="STOK_DUZELTME">{translate('koopApp.StokHareketiTipi.STOK_DUZELTME')}</option>
                  <option value="MASRAF">{translate('koopApp.StokHareketiTipi.MASRAF')}</option>
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label id="tarihLabel" for="stok-girisi-tarih">
                  <Translate contentKey="koopApp.stokGirisi.tarih">Tarih</Translate>
                </Label>
                <AvInput
                  id="stok-girisi-tarih"
                  type="datetime-local"
                  className="form-control"
                  name="tarih"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? null : convertDateTimeFromServer(props.stokGirisiEntity.tarih)}
                />
              </AvGroup>
              <AvGroup>
                <Label for="stok-girisi-user">
                  <Translate contentKey="koopApp.stokGirisi.user">User</Translate>
                </Label>
                <AvInput id="stok-girisi-user" type="select" className="form-control" name="user.id">
                  <option value="" key="0" />
                  {users
                    ? users.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.login}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label for="stok-girisi-urun">
                  <Translate contentKey="koopApp.stokGirisi.urun">Urun</Translate>
                </Label>
                <AvInput id="stok-girisi-urun" type="select" className="form-control" name="urun.id">
                  <option value="" key="0" />
                  {uruns
                    ? uruns.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.id}
                        </option>
                      ))
                    : null}
                </AvInput>
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
  uruns: storeState.urun.entities,
  stokGirisiEntity: storeState.stokGirisi.entity,
  loading: storeState.stokGirisi.loading,
  updating: storeState.stokGirisi.updating,
  updateSuccess: storeState.stokGirisi.updateSuccess
});

const mapDispatchToProps = {
  getUsers,
  getUruns,
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(StokGirisiUpdate);
