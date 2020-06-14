import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './urun-fiyat-hesap.reducer';
import { IUrunFiyatHesap } from 'app/shared/model/urun-fiyat-hesap.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IUrunFiyatHesapDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const UrunFiyatHesapDetail = (props: IUrunFiyatHesapDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { urunFiyatHesapEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="koopApp.urunFiyatHesap.detail.title">UrunFiyatHesap</Translate> [<b>{urunFiyatHesapEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="amortisman">
              <Translate contentKey="koopApp.urunFiyatHesap.amortisman">Amortisman</Translate>
            </span>
          </dt>
          <dd>{urunFiyatHesapEntity.amortisman}</dd>
          <dt>
            <span id="giderPusulaMustahsil">
              <Translate contentKey="koopApp.urunFiyatHesap.giderPusulaMustahsil">Gider Pusula Mustahsil</Translate>
            </span>
          </dt>
          <dd>{urunFiyatHesapEntity.giderPusulaMustahsil}</dd>
          <dt>
            <span id="dukkanGider">
              <Translate contentKey="koopApp.urunFiyatHesap.dukkanGider">Dukkan Gider</Translate>
            </span>
          </dt>
          <dd>{urunFiyatHesapEntity.dukkanGider}</dd>
          <dt>
            <span id="kooperatifCalisma">
              <Translate contentKey="koopApp.urunFiyatHesap.kooperatifCalisma">Kooperatif Calisma</Translate>
            </span>
          </dt>
          <dd>{urunFiyatHesapEntity.kooperatifCalisma}</dd>
          <dt>
            <span id="dayanisma">
              <Translate contentKey="koopApp.urunFiyatHesap.dayanisma">Dayanisma</Translate>
            </span>
          </dt>
          <dd>{urunFiyatHesapEntity.dayanisma}</dd>
          <dt>
            <span id="fire">
              <Translate contentKey="koopApp.urunFiyatHesap.fire">Fire</Translate>
            </span>
          </dt>
          <dd>{urunFiyatHesapEntity.fire}</dd>
          <dt>
            <Translate contentKey="koopApp.urunFiyatHesap.urun">Urun</Translate>
          </dt>
          <dd>{urunFiyatHesapEntity.urun ? urunFiyatHesapEntity.urun.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/urun-fiyat-hesap" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/urun-fiyat-hesap/${urunFiyatHesapEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ urunFiyatHesap }: IRootState) => ({
  urunFiyatHesapEntity: urunFiyatHesap.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(UrunFiyatHesapDetail);
