import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './kasa-hareketleri.reducer';
import { IKasaHareketleri } from 'app/shared/model/kasa-hareketleri.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IKasaHareketleriDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const KasaHareketleriDetail = (props: IKasaHareketleriDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { kasaHareketleriEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="koopApp.kasaHareketleri.detail.title">KasaHareketleri</Translate> [<b>{kasaHareketleriEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="kasaMiktar">
              <Translate contentKey="koopApp.kasaHareketleri.kasaMiktar">Kasa Miktar</Translate>
            </span>
          </dt>
          <dd>{kasaHareketleriEntity.kasaMiktar}</dd>
          <dt>
            <span id="hareket">
              <Translate contentKey="koopApp.kasaHareketleri.hareket">Hareket</Translate>
            </span>
          </dt>
          <dd>{kasaHareketleriEntity.hareket}</dd>
          <dt>
            <span id="tarih">
              <Translate contentKey="koopApp.kasaHareketleri.tarih">Tarih</Translate>
            </span>
          </dt>
          <dd>
            {kasaHareketleriEntity.tarih ? <TextFormat value={kasaHareketleriEntity.tarih} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
        </dl>
        <Button tag={Link} to="/kasa-hareketleri" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/kasa-hareketleri/${kasaHareketleriEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ kasaHareketleri }: IRootState) => ({
  kasaHareketleriEntity: kasaHareketleri.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(KasaHareketleriDetail);
