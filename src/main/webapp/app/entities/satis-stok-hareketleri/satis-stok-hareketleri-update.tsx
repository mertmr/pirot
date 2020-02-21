import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IUrun } from 'app/shared/model/urun.model';
import { getEntities as getUruns } from 'app/entities/urun/urun.reducer';
import { ISatis } from 'app/shared/model/satis.model';
import { getEntities as getSatis } from 'app/entities/satis/satis.reducer';
import { getEntity, updateEntity, createEntity, reset } from './satis-stok-hareketleri.reducer';
import { ISatisStokHareketleri } from 'app/shared/model/satis-stok-hareketleri.model';
import { convertDateTimeFromServer, convertDateTimeToServer } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface ISatisStokHareketleriUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const SatisStokHareketleriUpdate = (props: ISatisStokHareketleriUpdateProps) => {
  const [urunId, setUrunId] = useState('0');
  const [satisId, setSatisId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { satisStokHareketleriEntity, uruns, satis, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/satis-stok-hareketleri' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getUruns();
    props.getSatis();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...satisStokHareketleriEntity,
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
          <h2 id="koopApp.satisStokHareketleri.home.createOrEditLabel">
            <Translate contentKey="koopApp.satisStokHareketleri.home.createOrEditLabel">Create or edit a SatisStokHareketleri</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : satisStokHareketleriEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="satis-stok-hareketleri-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="satis-stok-hareketleri-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="miktarLabel" for="satis-stok-hareketleri-miktar">
                  <Translate contentKey="koopApp.satisStokHareketleri.miktar">Miktar</Translate>
                </Label>
                <AvField
                  id="satis-stok-hareketleri-miktar"
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
                <Label id="tutarLabel" for="satis-stok-hareketleri-tutar">
                  <Translate contentKey="koopApp.satisStokHareketleri.tutar">Tutar</Translate>
                </Label>
                <AvField
                  id="satis-stok-hareketleri-tutar"
                  type="text"
                  name="tutar"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                    number: { value: true, errorMessage: translate('entity.validation.number') }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label for="satis-stok-hareketleri-urun">
                  <Translate contentKey="koopApp.satisStokHareketleri.urun">Urun</Translate>
                </Label>
                <AvInput id="satis-stok-hareketleri-urun" type="select" className="form-control" name="urun.id">
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
              <AvGroup>
                <Label for="satis-stok-hareketleri-satis">
                  <Translate contentKey="koopApp.satisStokHareketleri.satis">Satis</Translate>
                </Label>
                <AvInput id="satis-stok-hareketleri-satis" type="select" className="form-control" name="satis.id">
                  <option value="" key="0" />
                  {satis
                    ? satis.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.id}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/satis-stok-hareketleri" replace color="info">
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
  uruns: storeState.urun.entities,
  satis: storeState.satis.entities,
  satisStokHareketleriEntity: storeState.satisStokHareketleri.entity,
  loading: storeState.satisStokHareketleri.loading,
  updating: storeState.satisStokHareketleri.updating,
  updateSuccess: storeState.satisStokHareketleri.updateSuccess
});

const mapDispatchToProps = {
  getUruns,
  getSatis,
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(SatisStokHareketleriUpdate);
