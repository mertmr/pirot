import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IUretici } from 'app/shared/model/uretici.model';
import { getEntities as getUreticis } from 'app/entities/uretici/uretici.reducer';
import { getEntity, updateEntity, createEntity, reset } from './uretici-odemeleri.reducer';
import { IUreticiOdemeleri } from 'app/shared/model/uretici-odemeleri.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IUreticiOdemeleriUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const UreticiOdemeleriUpdate = (props: IUreticiOdemeleriUpdateProps) => {
  const [ureticiId, setUreticiId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { ureticiOdemeleriEntity, ureticis, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/uretici-odemeleri' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getUreticis();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    values.sonGuncellenmeTarihi = convertDateTimeToServer(values.sonGuncellenmeTarihi);

    if (errors.length === 0) {
      const entity = {
        ...ureticiOdemeleriEntity,
        ...values,
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
          <h2 id="koopApp.ureticiOdemeleri.home.createOrEditLabel">
            <Translate contentKey="koopApp.ureticiOdemeleri.home.createOrEditLabel">Create or edit a UreticiOdemeleri</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : ureticiOdemeleriEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="uretici-odemeleri-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="uretici-odemeleri-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="tutarLabel" for="uretici-odemeleri-tutar">
                  <Translate contentKey="koopApp.ureticiOdemeleri.tutar">Tutar</Translate>
                </Label>
                <AvField id="uretici-odemeleri-tutar" type="text" name="tutar" />
              </AvGroup>
              <AvGroup>
                <Label id="sonGuncellenmeTarihiLabel" for="uretici-odemeleri-sonGuncellenmeTarihi">
                  <Translate contentKey="koopApp.ureticiOdemeleri.sonGuncellenmeTarihi">Son Guncellenme Tarihi</Translate>
                </Label>
                <AvInput
                  id="uretici-odemeleri-sonGuncellenmeTarihi"
                  type="datetime-local"
                  className="form-control"
                  name="sonGuncellenmeTarihi"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.ureticiOdemeleriEntity.sonGuncellenmeTarihi)}
                />
              </AvGroup>
              <AvGroup>
                <Label for="uretici-odemeleri-uretici">
                  <Translate contentKey="koopApp.ureticiOdemeleri.uretici">Uretici</Translate>
                </Label>
                <AvInput id="uretici-odemeleri-uretici" type="select" className="form-control" name="uretici.id">
                  <option value="" key="0" />
                  {ureticis
                    ? ureticis.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.adi}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/uretici-odemeleri" replace color="info">
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
  ureticis: storeState.uretici.entities,
  ureticiOdemeleriEntity: storeState.ureticiOdemeleri.entity,
  loading: storeState.ureticiOdemeleri.loading,
  updating: storeState.ureticiOdemeleri.updating,
  updateSuccess: storeState.ureticiOdemeleri.updateSuccess,
});

const mapDispatchToProps = {
  getUreticis,
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(UreticiOdemeleriUpdate);
