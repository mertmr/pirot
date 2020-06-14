import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './urun.reducer';
import { IUrun } from 'app/shared/model/urun.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IUrunDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const UrunDetail = (props: IUrunDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { urunEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="koopApp.urun.detail.title">Urun</Translate> [<b>{urunEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="urunAdi">
              <Translate contentKey="koopApp.urun.urunAdi">Urun Adi</Translate>
            </span>
          </dt>
          <dd>{urunEntity.urunAdi}</dd>
          <dt>
            <span id="stok">
              <Translate contentKey="koopApp.urun.stok">Stok</Translate>
            </span>
          </dt>
          <dd>{urunEntity.stok}</dd>
          <dt>
            <span id="stokSiniri">
              <Translate contentKey="koopApp.urun.stokSiniri">Stok Siniri</Translate>
            </span>
          </dt>
          <dd>{urunEntity.stokSiniri}</dd>
          <dt>
            <span id="musteriFiyati">
              <Translate contentKey="koopApp.urun.musteriFiyati">Musteri Fiyati</Translate>
            </span>
          </dt>
          <dd>{urunEntity.musteriFiyati}</dd>
          <dt>
            <span id="birim">
              <Translate contentKey="koopApp.urun.birim">Birim</Translate>
            </span>
          </dt>
          <dd>{urunEntity.birim}</dd>
          <dt>
            <span id="dayanismaUrunu">
              <Translate contentKey="koopApp.urun.dayanismaUrunu">Dayanisma Urunu</Translate>
            </span>
          </dt>
          <dd>{urunEntity.dayanismaUrunu ? 'true' : 'false'}</dd>
          <dt>
            <span id="satista">
              <Translate contentKey="koopApp.urun.satista">Satista</Translate>
            </span>
          </dt>
          <dd>{urunEntity.satista ? 'true' : 'false'}</dd>
          <dt>
            <span id="urunKategorisi">
              <Translate contentKey="koopApp.urun.urunKategorisi">Urun Kategorisi</Translate>
            </span>
          </dt>
          <dd>{urunEntity.urunKategorisi}</dd>
          <dt>
            <Translate contentKey="koopApp.urun.urunSorumlusu">Urun Sorumlusu</Translate>
          </dt>
          <dd>{urunEntity.urunSorumlusu ? urunEntity.urunSorumlusu.login : ''}</dd>
          <dt>
            <Translate contentKey="koopApp.urun.kdvKategorisi">Kdv Kategorisi</Translate>
          </dt>
          <dd>{urunEntity.kdvKategorisi ? urunEntity.kdvKategorisi.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/urun" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/urun/${urunEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ urun }: IRootState) => ({
  urunEntity: urun.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(UrunDetail);
