import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './kasa-hareketleri.reducer';
import { IKasaHareketleri } from 'app/shared/model/kasa-hareketleri.model';
import { convertDateTimeFromServer, convertDateTimeToServer } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IKasaHareketleriUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const KasaHareketleriUpdate = (props: IKasaHareketleriUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { kasaHareketleriEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/kasa-hareketleri' + props.location.search);
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
        ...kasaHareketleriEntity,
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
          <h2 id="koopApp.kasaHareketleri.home.createOrEditLabel">
            <Translate contentKey="koopApp.kasaHareketleri.home.createOrEditLabel">Create or edit a KasaHareketleri</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : kasaHareketleriEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="kasa-hareketleri-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="kasa-hareketleri-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="kasaMiktarLabel" for="kasa-hareketleri-kasaMiktar">
                  <Translate contentKey="koopApp.kasaHareketleri.kasaMiktar">Kasa Miktar</Translate>
                </Label>
                <AvField id="kasa-hareketleri-kasaMiktar" type="text" name="kasaMiktar" />
              </AvGroup>
              <AvGroup>
                <Label id="hareketLabel" for="kasa-hareketleri-hareket">
                  <Translate contentKey="koopApp.kasaHareketleri.hareket">Hareket</Translate>
                </Label>
                <AvField id="kasa-hareketleri-hareket" type="text" name="hareket" />
              </AvGroup>
              <AvGroup>
                <Label id="tarihLabel" for="kasa-hareketleri-tarih">
                  <Translate contentKey="koopApp.kasaHareketleri.tarih">Tarih</Translate>
                </Label>
                <AvInput
                  id="kasa-hareketleri-tarih"
                  type="datetime-local"
                  className="form-control"
                  name="tarih"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? null : convertDateTimeFromServer(props.kasaHareketleriEntity.tarih)}
                />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/kasa-hareketleri" replace color="info">
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
  kasaHareketleriEntity: storeState.kasaHareketleri.entity,
  loading: storeState.kasaHareketleri.loading,
  updating: storeState.kasaHareketleri.updating,
  updateSuccess: storeState.kasaHareketleri.updateSuccess
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(KasaHareketleriUpdate);
