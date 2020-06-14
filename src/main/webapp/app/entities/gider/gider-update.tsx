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
import { getEntity, updateEntity, createEntity, reset } from './gider.reducer';
import { IGider } from 'app/shared/model/gider.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IGiderUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const GiderUpdate = (props: IGiderUpdateProps) => {
  const [userId, setUserId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { giderEntity, users, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/gider' + props.location.search);
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
        ...giderEntity,
        ...values
      };
      entity.user = users[values.user];

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
          <h2 id="koopApp.gider.home.createOrEditLabel">
            <Translate contentKey="koopApp.gider.home.createOrEditLabel">Create or edit a Gider</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : giderEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="gider-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="gider-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="tarihLabel" for="gider-tarih">
                  <Translate contentKey="koopApp.gider.tarih">Tarih</Translate>
                </Label>
                <AvInput
                  id="gider-tarih"
                  type="datetime-local"
                  className="form-control"
                  name="tarih"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.giderEntity.tarih)}
                />
              </AvGroup>
              <AvGroup>
                <Label id="tutarLabel" for="gider-tutar">
                  <Translate contentKey="koopApp.gider.tutar">Tutar</Translate>
                </Label>
                <AvField
                  id="gider-tutar"
                  type="text"
                  name="tutar"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                    number: { value: true, errorMessage: translate('entity.validation.number') }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="notlarLabel" for="gider-notlar">
                  <Translate contentKey="koopApp.gider.notlar">Notlar</Translate>
                </Label>
                <AvField
                  id="gider-notlar"
                  type="text"
                  name="notlar"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="giderTipiLabel" for="gider-giderTipi">
                  <Translate contentKey="koopApp.gider.giderTipi">Gider Tipi</Translate>
                </Label>
                <AvInput
                  id="gider-giderTipi"
                  type="select"
                  className="form-control"
                  name="giderTipi"
                  value={(!isNew && giderEntity.giderTipi) || 'KARGO'}
                >
                  <option value="KARGO">{translate('koopApp.GiderTipi.KARGO')}</option>
                  <option value="SU">{translate('koopApp.GiderTipi.SU')}</option>
                  <option value="DIGER">{translate('koopApp.GiderTipi.DIGER')}</option>
                  <option value="VERGI">{translate('koopApp.GiderTipi.VERGI')}</option>
                  <option value="KIRA">{translate('koopApp.GiderTipi.KIRA')}</option>
                  <option value="AIDAT">{translate('koopApp.GiderTipi.AIDAT')}</option>
                  <option value="TAKSI">{translate('koopApp.GiderTipi.TAKSI')}</option>
                  <option value="ELEKTRIK">{translate('koopApp.GiderTipi.ELEKTRIK')}</option>
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label id="odemeAraciLabel" for="gider-odemeAraci">
                  <Translate contentKey="koopApp.gider.odemeAraci">Odeme Araci</Translate>
                </Label>
                <AvInput
                  id="gider-odemeAraci"
                  type="select"
                  className="form-control"
                  name="odemeAraci"
                  value={(!isNew && giderEntity.odemeAraci) || 'NAKIT'}
                >
                  <option value="NAKIT">{translate('koopApp.OdemeAraci.NAKIT')}</option>
                  <option value="BANKA">{translate('koopApp.OdemeAraci.BANKA')}</option>
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label for="gider-user">
                  <Translate contentKey="koopApp.gider.user">User</Translate>
                </Label>
                <AvInput id="gider-user" type="select" className="form-control" name="user">
                  <option value="" key="0" />
                  {users
                    ? users.map((otherEntity, index) => (
                        <option value={index} key={otherEntity.id}>
                          {otherEntity.login}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/gider" replace color="info">
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
  giderEntity: storeState.gider.entity,
  loading: storeState.gider.loading,
  updating: storeState.gider.updating,
  updateSuccess: storeState.gider.updateSuccess
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

export default connect(mapStateToProps, mapDispatchToProps)(GiderUpdate);
