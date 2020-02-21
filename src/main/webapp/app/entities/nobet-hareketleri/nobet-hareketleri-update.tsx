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
import { getEntity, updateEntity, createEntity, reset } from './nobet-hareketleri.reducer';
import { INobetHareketleri } from 'app/shared/model/nobet-hareketleri.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface INobetHareketleriUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const NobetHareketleriUpdate = (props: INobetHareketleriUpdateProps) => {
  const [userId, setUserId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { nobetHareketleriEntity, users, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/nobet-hareketleri' + props.location.search);
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
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    values.tarih = convertDateTimeToServer(values.tarih);

    if (errors.length === 0) {
      const entity = {
        ...nobetHareketleriEntity,
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
          <h2 id="koopApp.nobetHareketleri.home.createOrEditLabel">
            <Translate contentKey="koopApp.nobetHareketleri.home.createOrEditLabel">Create or edit a NobetHareketleri</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : nobetHareketleriEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="nobet-hareketleri-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="nobet-hareketleri-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="kasaLabel" for="nobet-hareketleri-kasa">
                  <Translate contentKey="koopApp.nobetHareketleri.kasa">Kasa</Translate>
                </Label>
                <AvField id="nobet-hareketleri-kasa" type="text" name="kasa" />
              </AvGroup>
              <AvGroup>
                <Label id="pirotLabel" for="nobet-hareketleri-pirot">
                  <Translate contentKey="koopApp.nobetHareketleri.pirot">Pirot</Translate>
                </Label>
                <AvField id="nobet-hareketleri-pirot" type="text" name="pirot" />
              </AvGroup>
              <AvGroup>
                <Label id="farkLabel" for="nobet-hareketleri-fark">
                  <Translate contentKey="koopApp.nobetHareketleri.fark">Fark</Translate>
                </Label>
                <AvField id="nobet-hareketleri-fark" type="text" name="fark" />
              </AvGroup>
              <AvGroup>
                <Label id="nobetSuresiLabel" for="nobet-hareketleri-nobetSuresi">
                  <Translate contentKey="koopApp.nobetHareketleri.nobetSuresi">Nobet Suresi</Translate>
                </Label>
                <AvField id="nobet-hareketleri-nobetSuresi" type="text" name="nobetSuresi" />
              </AvGroup>
              <AvGroup>
                <Label id="notlarLabel" for="nobet-hareketleri-notlar">
                  <Translate contentKey="koopApp.nobetHareketleri.notlar">Notlar</Translate>
                </Label>
                <AvField id="nobet-hareketleri-notlar" type="text" name="notlar" />
              </AvGroup>
              <AvGroup>
                <Label id="tarihLabel" for="nobet-hareketleri-tarih">
                  <Translate contentKey="koopApp.nobetHareketleri.tarih">Tarih</Translate>
                </Label>
                <AvInput
                  id="nobet-hareketleri-tarih"
                  type="datetime-local"
                  className="form-control"
                  name="tarih"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.nobetHareketleriEntity.tarih)}
                />
              </AvGroup>
              <AvGroup>
                <Label for="nobet-hareketleri-user">
                  <Translate contentKey="koopApp.nobetHareketleri.user">User</Translate>
                </Label>
                <AvInput id="nobet-hareketleri-user" type="select" className="form-control" name="user.id">
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
              <Button tag={Link} id="cancel-save" to="/nobet-hareketleri" replace color="info">
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
  nobetHareketleriEntity: storeState.nobetHareketleri.entity,
  loading: storeState.nobetHareketleri.loading,
  updating: storeState.nobetHareketleri.updating,
  updateSuccess: storeState.nobetHareketleri.updateSuccess
});

const mapDispatchToProps = {
  getUsers,
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(NobetHareketleriUpdate);
