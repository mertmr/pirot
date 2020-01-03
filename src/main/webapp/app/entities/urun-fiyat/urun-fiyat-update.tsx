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
import { getEntity, updateEntity, createEntity, reset } from './urun-fiyat.reducer';
import { IUrunFiyat } from 'app/shared/model/urun-fiyat.model';
import { convertDateTimeFromServer, convertDateTimeToServer } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IUrunFiyatUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const UrunFiyatUpdate = (props: IUrunFiyatUpdateProps) => {
  const [userId, setUserId] = useState('0');
  const [urunId, setUrunId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { urunFiyatEntity, users, uruns, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/urun-fiyat');
  };

  useEffect(() => {
    if (!isNew) {
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
        ...urunFiyatEntity,
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
          <h2 id="koopApp.urunFiyat.home.createOrEditLabel">
            <Translate contentKey="koopApp.urunFiyat.home.createOrEditLabel">Create or edit a UrunFiyat</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : urunFiyatEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="urun-fiyat-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="urun-fiyat-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="fiyatLabel" for="urun-fiyat-fiyat">
                  <Translate contentKey="koopApp.urunFiyat.fiyat">Fiyat</Translate>
                </Label>
                <AvField id="urun-fiyat-fiyat" type="string" className="form-control" name="fiyat" />
              </AvGroup>
              <AvGroup>
                <Label id="tarihLabel" for="urun-fiyat-tarih">
                  <Translate contentKey="koopApp.urunFiyat.tarih">Tarih</Translate>
                </Label>
                <AvInput
                  id="urun-fiyat-tarih"
                  type="datetime-local"
                  className="form-control"
                  name="tarih"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? null : convertDateTimeFromServer(props.urunFiyatEntity.tarih)}
                />
              </AvGroup>
              <AvGroup>
                <Label for="urun-fiyat-user">
                  <Translate contentKey="koopApp.urunFiyat.user">User</Translate>
                </Label>
                <AvInput id="urun-fiyat-user" type="select" className="form-control" name="user.id">
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
                <Label for="urun-fiyat-urun">
                  <Translate contentKey="koopApp.urunFiyat.urun">Urun</Translate>
                </Label>
                <AvInput id="urun-fiyat-urun" type="select" className="form-control" name="urun.id">
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
              <Button tag={Link} id="cancel-save" to="/urun-fiyat" replace color="info">
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
  urunFiyatEntity: storeState.urunFiyat.entity,
  loading: storeState.urunFiyat.loading,
  updating: storeState.urunFiyat.updating,
  updateSuccess: storeState.urunFiyat.updateSuccess
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

export default connect(mapStateToProps, mapDispatchToProps)(UrunFiyatUpdate);
