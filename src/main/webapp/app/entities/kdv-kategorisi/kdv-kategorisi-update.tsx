import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './kdv-kategorisi.reducer';
import { IKdvKategorisi } from 'app/shared/model/kdv-kategorisi.model';
import { convertDateTimeFromServer, convertDateTimeToServer } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IKdvKategorisiUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const KdvKategorisiUpdate = (props: IKdvKategorisiUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { kdvKategorisiEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/kdv-kategorisi');
  };

  useEffect(() => {
    if (!isNew) {
      props.getEntity(props.match.params.id);
    }
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...kdvKategorisiEntity,
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
          <h2 id="koopApp.kdvKategorisi.home.createOrEditLabel">
            <Translate contentKey="koopApp.kdvKategorisi.home.createOrEditLabel">Create or edit a KdvKategorisi</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : kdvKategorisiEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="kdv-kategorisi-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="kdv-kategorisi-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="kategoriAdiLabel" for="kdv-kategorisi-kategoriAdi">
                  <Translate contentKey="koopApp.kdvKategorisi.kategoriAdi">Kategori Adi</Translate>
                </Label>
                <AvField
                  id="kdv-kategorisi-kategoriAdi"
                  type="text"
                  name="kategoriAdi"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="kdvOraniLabel" for="kdv-kategorisi-kdvOrani">
                  <Translate contentKey="koopApp.kdvKategorisi.kdvOrani">Kdv Orani</Translate>
                </Label>
                <AvField
                  id="kdv-kategorisi-kdvOrani"
                  type="string"
                  className="form-control"
                  name="kdvOrani"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                    number: { value: true, errorMessage: translate('entity.validation.number') }
                  }}
                />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/kdv-kategorisi" replace color="info">
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
  kdvKategorisiEntity: storeState.kdvKategorisi.entity,
  loading: storeState.kdvKategorisi.loading,
  updating: storeState.kdvKategorisi.updating,
  updateSuccess: storeState.kdvKategorisi.updateSuccess
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(KdvKategorisiUpdate);
