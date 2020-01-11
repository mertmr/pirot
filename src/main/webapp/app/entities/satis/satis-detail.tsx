import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Table } from 'reactstrap';
import {Translate, ICrudGetAction, TextFormat, JhiItemCount, JhiPagination} from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './satis.reducer';
import { ISatis } from 'app/shared/model/satis.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ISatisDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const SatisDetail = (props: ISatisDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { satisEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="koopApp.satis.detail.title">Satis</Translate> [<b>{satisEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="tarih">
              <Translate contentKey="koopApp.satis.tarih">Tarih</Translate>
            </span>
          </dt>
          <dd>
            <TextFormat value={satisEntity.tarih} type="date" format={APP_DATE_FORMAT} />
          </dd>
          <dt>
            <span id="toplamTutar">
              <Translate contentKey="koopApp.satis.toplamTutar">Toplam Tutar</Translate>
            </span>
          </dt>
          <dd>{satisEntity.toplamTutar}</dd>
          <dt>
            <span id="ortagaSatis">
              <Translate contentKey="koopApp.satis.ortagaSatis">Ortaga Satis</Translate>
            </span>
          </dt>
          <dd>{satisEntity.ortagaSatis ? 'true' : 'false'}</dd>
          <dt>
            <Translate contentKey="koopApp.satis.user">User</Translate>
          </dt>
          <dd>{satisEntity.user ? satisEntity.user.login : ''}</dd>
        </dl>
          <div className="table-responsive">
            {satisEntity.stokHareketleriLists && satisEntity.stokHareketleriLists.length > 0 ? (
              <Table responsive>
                <thead>
                <tr>
                  <th className="hand">
                    <Translate contentKey="koopApp.satisStokHareketleri.miktar">Miktar</Translate>
                  </th>
                  <th className="hand">
                    <Translate contentKey="koopApp.satisStokHareketleri.tutar">Tutar</Translate>
                  </th>
                  <th>
                    <Translate contentKey="koopApp.satisStokHareketleri.urun">Urun</Translate>
                  </th>
                  <th />
                </tr>
                </thead>
                <tbody>
                {satisEntity.stokHareketleriLists.map((satisStokHareketleri, i) => (
                  <tr key={`entity-${i}`}>
                    <td>{satisStokHareketleri.miktar}</td>
                    <td>{satisStokHareketleri.tutar} TL</td>
                    <td>{satisStokHareketleri.urun.urunAdi}</td>
                  </tr>
                ))}
                </tbody>
              </Table>
            ) : (
              <div className="alert alert-warning">
                <Translate contentKey="koopApp.satisStokHareketleri.home.notFound">No Satis Stok Hareketleris found</Translate>
              </div>
            )}
          </div>
        <Button tag={Link} to="/satis" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/satis/${satisEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ satis }: IRootState) => ({
  satisEntity: satis.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(SatisDetail);
