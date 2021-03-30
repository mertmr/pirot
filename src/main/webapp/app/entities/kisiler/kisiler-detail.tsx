import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './kisiler.reducer';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IKisilerDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const KisilerDetail = (props: IKisilerDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { kisilerEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="kisilerDetailsHeading">
          <Translate contentKey="koopApp.kisiler.detail.title">Kisiler</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{kisilerEntity.id}</dd>
          <dt>
            <span id="kisiAdi">
              <Translate contentKey="koopApp.kisiler.kisiAdi">Kisi Adi</Translate>
            </span>
          </dt>
          <dd>{kisilerEntity.kisiAdi}</dd>
          <dt>
            <span id="notlar">
              <Translate contentKey="koopApp.kisiler.notlar">Notlar</Translate>
            </span>
          </dt>
          <dd>{kisilerEntity.notlar}</dd>
          <dt>
            <span id="tarih">
              <Translate contentKey="koopApp.kisiler.tarih">Tarih</Translate>
            </span>
          </dt>
          <dd>{kisilerEntity.tarih ? <TextFormat value={kisilerEntity.tarih} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="active">
              <Translate contentKey="koopApp.kisiler.active">Active</Translate>
            </span>
          </dt>
          <dd>{kisilerEntity.active ? 'true' : 'false'}</dd>
        </dl>
        <Button tag={Link} to="/kisiler" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/kisiler/${kisilerEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ kisiler }: IRootState) => ({
  kisilerEntity: kisiler.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(KisilerDetail);
