import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './urun-fiyat.reducer';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IUrunFiyatDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const UrunFiyatDetail = (props: IUrunFiyatDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { urunFiyatEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="urunFiyatDetailsHeading">
          <Translate contentKey="koopApp.urunFiyat.detail.title">UrunFiyat</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{urunFiyatEntity.id}</dd>
          <dt>
            <span id="fiyat">
              <Translate contentKey="koopApp.urunFiyat.fiyat">Fiyat</Translate>
            </span>
          </dt>
          <dd>{urunFiyatEntity.fiyat}</dd>
          <dt>
            <span id="tarih">
              <Translate contentKey="koopApp.urunFiyat.tarih">Tarih</Translate>
            </span>
          </dt>
          <dd>{urunFiyatEntity.tarih ? <TextFormat value={urunFiyatEntity.tarih} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <Translate contentKey="koopApp.urunFiyat.user">User</Translate>
          </dt>
          <dd>{urunFiyatEntity.user ? urunFiyatEntity.user.login : ''}</dd>
          <dt>
            <Translate contentKey="koopApp.urunFiyat.urun">Urun</Translate>
          </dt>
          <dd>{urunFiyatEntity.urun ? urunFiyatEntity.urun.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/urun-fiyat" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/urun-fiyat/${urunFiyatEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ urunFiyat }: IRootState) => ({
  urunFiyatEntity: urunFiyat.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(UrunFiyatDetail);
