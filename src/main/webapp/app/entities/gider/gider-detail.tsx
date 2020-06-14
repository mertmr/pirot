import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './gider.reducer';
import { IGider } from 'app/shared/model/gider.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IGiderDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const GiderDetail = (props: IGiderDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { giderEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="koopApp.gider.detail.title">Gider</Translate> [<b>{giderEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="tarih">
              <Translate contentKey="koopApp.gider.tarih">Tarih</Translate>
            </span>
          </dt>
          <dd>{giderEntity.tarih ? <TextFormat value={giderEntity.tarih} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="tutar">
              <Translate contentKey="koopApp.gider.tutar">Tutar</Translate>
            </span>
          </dt>
          <dd>{giderEntity.tutar}</dd>
          <dt>
            <span id="notlar">
              <Translate contentKey="koopApp.gider.notlar">Notlar</Translate>
            </span>
          </dt>
          <dd>{giderEntity.notlar}</dd>
          <dt>
            <span id="giderTipi">
              <Translate contentKey="koopApp.gider.giderTipi">Gider Tipi</Translate>
            </span>
          </dt>
          <dd>{giderEntity.giderTipi}</dd>
          <dt>
            <span id="odemeAraci">
              <Translate contentKey="koopApp.gider.odemeAraci">Odeme Araci</Translate>
            </span>
          </dt>
          <dd>{giderEntity.odemeAraci}</dd>
          <dt>
            <Translate contentKey="koopApp.gider.user">User</Translate>
          </dt>
          <dd>{giderEntity.user ? giderEntity.user.login : ''}</dd>
        </dl>
        <Button tag={Link} to="/gider" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/gider/${giderEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ gider }: IRootState) => ({
  giderEntity: gider.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(GiderDetail);
