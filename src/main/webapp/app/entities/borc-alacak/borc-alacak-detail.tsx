import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './borc-alacak.reducer';
import { IBorcAlacak } from 'app/shared/model/borc-alacak.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IBorcAlacakDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const BorcAlacakDetail = (props: IBorcAlacakDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { borcAlacakEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="koopApp.borcAlacak.detail.title">BorcAlacak</Translate> [<b>{borcAlacakEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="tutar">
              <Translate contentKey="koopApp.borcAlacak.tutar">Tutar</Translate>
            </span>
          </dt>
          <dd>{borcAlacakEntity.tutar}</dd>
          <dt>
            <span id="notlar">
              <Translate contentKey="koopApp.borcAlacak.notlar">Notlar</Translate>
            </span>
          </dt>
          <dd>{borcAlacakEntity.notlar}</dd>
          <dt>
            <span id="odemeAraci">
              <Translate contentKey="koopApp.borcAlacak.odemeAraci">Odeme Araci</Translate>
            </span>
          </dt>
          <dd>{borcAlacakEntity.odemeAraci}</dd>
          <dt>
            <span id="hareketTipi">
              <Translate contentKey="koopApp.borcAlacak.hareketTipi">Hareket Tipi</Translate>
            </span>
          </dt>
          <dd>{borcAlacakEntity.hareketTipi}</dd>
          <dt>
            <span id="tarih">
              <Translate contentKey="koopApp.borcAlacak.tarih">Tarih</Translate>
            </span>
          </dt>
          <dd>{borcAlacakEntity.tarih ? <TextFormat value={borcAlacakEntity.tarih} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <Translate contentKey="koopApp.borcAlacak.user">User</Translate>
          </dt>
          <dd>{borcAlacakEntity.user ? borcAlacakEntity.user.login : ''}</dd>
          <dt>
            <Translate contentKey="koopApp.borcAlacak.urun">Urun</Translate>
          </dt>
          <dd>{borcAlacakEntity.urun ? borcAlacakEntity.urun.urunAdi : ''}</dd>
        </dl>
        <Button tag={Link} to="/borc-alacak" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/borc-alacak/${borcAlacakEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ borcAlacak }: IRootState) => ({
  borcAlacakEntity: borcAlacak.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(BorcAlacakDetail);
