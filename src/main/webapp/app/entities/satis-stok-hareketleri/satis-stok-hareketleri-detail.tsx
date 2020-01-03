import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './satis-stok-hareketleri.reducer';
import { ISatisStokHareketleri } from 'app/shared/model/satis-stok-hareketleri.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ISatisStokHareketleriDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const SatisStokHareketleriDetail = (props: ISatisStokHareketleriDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { satisStokHareketleriEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="koopApp.satisStokHareketleri.detail.title">SatisStokHareketleri</Translate> [
          <b>{satisStokHareketleriEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="miktar">
              <Translate contentKey="koopApp.satisStokHareketleri.miktar">Miktar</Translate>
            </span>
          </dt>
          <dd>{satisStokHareketleriEntity.miktar}</dd>
          <dt>
            <span id="tutar">
              <Translate contentKey="koopApp.satisStokHareketleri.tutar">Tutar</Translate>
            </span>
          </dt>
          <dd>{satisStokHareketleriEntity.tutar}</dd>
          <dt>
            <Translate contentKey="koopApp.satisStokHareketleri.satis">Satis</Translate>
          </dt>
          <dd>{satisStokHareketleriEntity.satis ? satisStokHareketleriEntity.satis.id : ''}</dd>
          <dt>
            <Translate contentKey="koopApp.satisStokHareketleri.urun">Urun</Translate>
          </dt>
          <dd>{satisStokHareketleriEntity.urun ? satisStokHareketleriEntity.urun.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/satis-stok-hareketleri" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/satis-stok-hareketleri/${satisStokHareketleriEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ satisStokHareketleri }: IRootState) => ({
  satisStokHareketleriEntity: satisStokHareketleri.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(SatisStokHareketleriDetail);
