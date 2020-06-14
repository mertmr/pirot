import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './kisiler.reducer';
import { IKisiler } from 'app/shared/model/kisiler.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IKisilerUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const KisilerUpdate = (props: IKisilerUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { kisilerEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/kisiler' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }
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
        ...kisilerEntity,
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
          <h2 id="koopApp.kisiler.home.createOrEditLabel">
            <Translate contentKey="koopApp.kisiler.home.createOrEditLabel">Create or edit a Kisiler</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : kisilerEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="kisiler-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="kisiler-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="kisiAdiLabel" for="kisiler-kisiAdi">
                  <Translate contentKey="koopApp.kisiler.kisiAdi">Kisi Adi</Translate>
                </Label>
                <AvField id="kisiler-kisiAdi" type="text" name="kisiAdi" />
              </AvGroup>
              <AvGroup>
                <Label id="notlarLabel" for="kisiler-notlar">
                  <Translate contentKey="koopApp.kisiler.notlar">Notlar</Translate>
                </Label>
                <AvField id="kisiler-notlar" type="text" name="notlar" />
              </AvGroup>
              <AvGroup>
                <Label id="tarihLabel" for="kisiler-tarih">
                  <Translate contentKey="koopApp.kisiler.tarih">Tarih</Translate>
                </Label>
                <AvInput
                  id="kisiler-tarih"
                  type="datetime-local"
                  className="form-control"
                  name="tarih"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.kisilerEntity.tarih)}
                />
              </AvGroup>
              <AvGroup check>
                <Label id="activeLabel">
                  <AvInput id="kisiler-active" type="checkbox" className="form-check-input" name="active" />
                  <Translate contentKey="koopApp.kisiler.active">Active</Translate>
                </Label>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/kisiler" replace color="info">
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
  kisilerEntity: storeState.kisiler.entity,
  loading: storeState.kisiler.loading,
  updating: storeState.kisiler.updating,
  updateSuccess: storeState.kisiler.updateSuccess
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(KisilerUpdate);
