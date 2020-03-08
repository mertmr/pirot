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
import { getEntity, updateEntity, createEntity, reset } from './borc-alacak.reducer';
import { IBorcAlacak } from 'app/shared/model/borc-alacak.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IBorcAlacakUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const BorcAlacakUpdate = (props: IBorcAlacakUpdateProps) => {
  const [userId, setUserId] = useState('0');
  const [urunId, setUrunId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { borcAlacakEntity, users, uruns, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/borc-alacak' + props.location.search);
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
        ...borcAlacakEntity,
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
          <h2 id="koopApp.borcAlacak.home.createOrEditLabel">
            <Translate contentKey="koopApp.borcAlacak.home.createOrEditLabel">Create or edit a BorcAlacak</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : borcAlacakEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="borc-alacak-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="borc-alacak-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="tutarLabel" for="borc-alacak-tutar">
                  <Translate contentKey="koopApp.borcAlacak.tutar">Tutar</Translate>
                </Label>
                <AvField id="borc-alacak-tutar" type="text" name="tutar" />
              </AvGroup>
              <AvGroup>
                <Label id="notlarLabel" for="borc-alacak-notlar">
                  <Translate contentKey="koopApp.borcAlacak.notlar">Notlar</Translate>
                </Label>
                <AvField id="borc-alacak-notlar" type="text" name="notlar" />
              </AvGroup>
              <AvGroup>
                <Label id="odemeAraciLabel" for="borc-alacak-odemeAraci">
                  <Translate contentKey="koopApp.borcAlacak.odemeAraci">Odeme Araci</Translate>
                </Label>
                <AvInput
                  id="borc-alacak-odemeAraci"
                  type="select"
                  className="form-control"
                  name="odemeAraci"
                  value={(!isNew && borcAlacakEntity.odemeAraci) || 'NAKIT'}
                >
                  <option value="NAKIT">{translate('koopApp.OdemeAraci.NAKIT')}</option>
                  <option value="BANKA">{translate('koopApp.OdemeAraci.BANKA')}</option>
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label id="hareketTipiLabel" for="borc-alacak-hareketTipi">
                  <Translate contentKey="koopApp.borcAlacak.hareketTipi">Hareket Tipi</Translate>
                </Label>
                <AvInput
                  id="borc-alacak-hareketTipi"
                  type="select"
                  className="form-control"
                  name="hareketTipi"
                  value={(!isNew && borcAlacakEntity.hareketTipi) || 'URUN_GIRISI'}
                >
                  <option value="URUN_GIRISI">{translate('koopApp.HareketTipi.URUN_GIRISI')}</option>
                  <option value="ODEME">{translate('koopApp.HareketTipi.ODEME')}</option>
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label id="tarihLabel" for="borc-alacak-tarih">
                  <Translate contentKey="koopApp.borcAlacak.tarih">Tarih</Translate>
                </Label>
                <AvInput
                  id="borc-alacak-tarih"
                  type="datetime-local"
                  className="form-control"
                  name="tarih"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.borcAlacakEntity.tarih)}
                />
              </AvGroup>
              <AvGroup>
                <Label for="borc-alacak-user">
                  <Translate contentKey="koopApp.borcAlacak.user">User</Translate>
                </Label>
                <AvInput id="borc-alacak-user" type="select" className="form-control" name="user">
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
              <AvGroup>
                <Label for="borc-alacak-urun">
                  <Translate contentKey="koopApp.borcAlacak.urun">Urun</Translate>
                </Label>
                <AvInput id="borc-alacak-urun" type="select" className="form-control" name="urun.id">
                  <option value="" key="0" />
                  {uruns
                    ? uruns.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.urunAdi}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/borc-alacak" replace color="info">
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
  borcAlacakEntity: storeState.borcAlacak.entity,
  loading: storeState.borcAlacak.loading,
  updating: storeState.borcAlacak.updating,
  updateSuccess: storeState.borcAlacak.updateSuccess
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

export default connect(mapStateToProps, mapDispatchToProps)(BorcAlacakUpdate);
