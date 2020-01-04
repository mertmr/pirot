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
import { getEntity, updateEntity, createEntity, reset } from './virman.reducer';
import { IVirman } from 'app/shared/model/virman.model';
import { convertDateTimeFromServer, convertDateTimeToServer } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IVirmanUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const VirmanUpdate = (props: IVirmanUpdateProps) => {
  const [userId, setUserId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { virmanEntity, users, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/virman' + props.location.search);
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
        ...virmanEntity,
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
          <h2 id="koopApp.virman.home.createOrEditLabel">
            <Translate contentKey="koopApp.virman.home.createOrEditLabel">Create or edit a Virman</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : virmanEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="virman-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="virman-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="tutarLabel" for="virman-tutar">
                  <Translate contentKey="koopApp.virman.tutar">Tutar</Translate>
                </Label>
                <AvField
                  id="virman-tutar"
                  type="string"
                  className="form-control"
                  name="tutar"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                    number: { value: true, errorMessage: translate('entity.validation.number') }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="notlarLabel" for="virman-notlar">
                  <Translate contentKey="koopApp.virman.notlar">Notlar</Translate>
                </Label>
                <AvField
                  id="virman-notlar"
                  type="text"
                  name="notlar"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="cikisHesabiLabel" for="virman-cikisHesabi">
                  <Translate contentKey="koopApp.virman.cikisHesabi">Cikis Hesabi</Translate>
                </Label>
                <AvInput
                  id="virman-cikisHesabi"
                  type="select"
                  className="form-control"
                  name="cikisHesabi"
                  value={(!isNew && virmanEntity.cikisHesabi) || 'KASA'}
                >
                  <option value="KASA">{translate('koopApp.Hesap.KASA')}</option>
                  <option value="BANKA">{translate('koopApp.Hesap.BANKA')}</option>
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label id="girisHesabiLabel" for="virman-girisHesabi">
                  <Translate contentKey="koopApp.virman.girisHesabi">Giris Hesabi</Translate>
                </Label>
                <AvInput
                  id="virman-girisHesabi"
                  type="select"
                  className="form-control"
                  name="girisHesabi"
                  value={(!isNew && virmanEntity.girisHesabi) || 'KASA'}
                >
                  <option value="KASA">{translate('koopApp.Hesap.KASA')}</option>
                  <option value="BANKA">{translate('koopApp.Hesap.BANKA')}</option>
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label id="tarihLabel" for="virman-tarih">
                  <Translate contentKey="koopApp.virman.tarih">Tarih</Translate>
                </Label>
                <AvInput
                  id="virman-tarih"
                  type="datetime-local"
                  className="form-control"
                  name="tarih"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? null : convertDateTimeFromServer(props.virmanEntity.tarih)}
                />
              </AvGroup>
              <AvGroup>
                <Label for="virman-user">
                  <Translate contentKey="koopApp.virman.user">User</Translate>
                </Label>
                <AvInput id="virman-user" type="select" className="form-control" name="user.id">
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
              <Button tag={Link} id="cancel-save" to="/virman" replace color="info">
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
  virmanEntity: storeState.virman.entity,
  loading: storeState.virman.loading,
  updating: storeState.virman.updating,
  updateSuccess: storeState.virman.updateSuccess
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

export default connect(mapStateToProps, mapDispatchToProps)(VirmanUpdate);
