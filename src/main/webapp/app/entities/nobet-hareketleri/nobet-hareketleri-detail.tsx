import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './nobet-hareketleri.reducer';
import { INobetHareketleri } from 'app/shared/model/nobet-hareketleri.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface INobetHareketleriDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const NobetHareketleriDetail = (props: INobetHareketleriDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { nobetHareketleriEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="koopApp.nobetHareketleri.detail.title">NobetHareketleri</Translate> [<b>{nobetHareketleriEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="kasa">
              <Translate contentKey="koopApp.nobetHareketleri.kasa">Kasa</Translate>
            </span>
          </dt>
          <dd>{nobetHareketleriEntity.kasa}</dd>
          <dt>
            <span id="pirot">
              <Translate contentKey="koopApp.nobetHareketleri.pirot">Pirot</Translate>
            </span>
          </dt>
          <dd>{nobetHareketleriEntity.pirot}</dd>
          <dt>
            <span id="fark">
              <Translate contentKey="koopApp.nobetHareketleri.fark">Fark</Translate>
            </span>
          </dt>
          <dd>{nobetHareketleriEntity.fark}</dd>
          <dt>
            <span id="nobetSuresi">
              <Translate contentKey="koopApp.nobetHareketleri.nobetSuresi">Nobet Suresi</Translate>
            </span>
          </dt>
          <dd>{nobetHareketleriEntity.nobetSuresi}</dd>
          <dt>
            <span id="notlar">
              <Translate contentKey="koopApp.nobetHareketleri.notlar">Notlar</Translate>
            </span>
          </dt>
          <dd>{nobetHareketleriEntity.notlar}</dd>
          <dt>
            <span id="acilisKapanis">
              <Translate contentKey="koopApp.nobetHareketleri.acilisKapanis">Acilis Kapanis</Translate>
            </span>
          </dt>
          <dd>{nobetHareketleriEntity.acilisKapanis}</dd>
          <dt>
            <span id="tarih">
              <Translate contentKey="koopApp.nobetHareketleri.tarih">Tarih</Translate>
            </span>
          </dt>
          <dd>
            {nobetHareketleriEntity.tarih ? <TextFormat value={nobetHareketleriEntity.tarih} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
          <dt>
            <Translate contentKey="koopApp.nobetHareketleri.user">User</Translate>
          </dt>
          <dd>{nobetHareketleriEntity.user ? nobetHareketleriEntity.user.login : ''}</dd>
        </dl>
        <Button tag={Link} to="/nobet-hareketleri" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/nobet-hareketleri/${nobetHareketleriEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ nobetHareketleri }: IRootState) => ({
  nobetHareketleriEntity: nobetHareketleri.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(NobetHareketleriDetail);
