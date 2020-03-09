import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './stok-girisi.reducer';
import { IStokGirisi } from 'app/shared/model/stok-girisi.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IStokGirisiDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const StokGirisiDetail = (props: IStokGirisiDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { stokGirisiEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="koopApp.stokGirisi.detail.title">StokGirisi</Translate> [<b>{stokGirisiEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="miktar">
              <Translate contentKey="koopApp.stokGirisi.miktar">Miktar</Translate>
            </span>
          </dt>
          <dd>{stokGirisiEntity.miktar}</dd>
          <dt>
            <span id="notlar">
              <Translate contentKey="koopApp.stokGirisi.notlar">Notlar</Translate>
            </span>
          </dt>
          <dd>{stokGirisiEntity.notlar}</dd>
          <dt>
            <span id="stokHareketiTipi">
              <Translate contentKey="koopApp.stokGirisi.stokHareketiTipi">Stok Hareketi Tipi</Translate>
            </span>
          </dt>
          <dd>{stokGirisiEntity.stokHareketiTipi}</dd>
          <dt>
            <span id="tarih">
              <Translate contentKey="koopApp.stokGirisi.tarih">Tarih</Translate>
            </span>
          </dt>
          <dd>
            <TextFormat value={stokGirisiEntity.tarih} type="date" format={APP_DATE_FORMAT} />
          </dd>
          <dt>
            <Translate contentKey="koopApp.stokGirisi.user">User</Translate>
          </dt>
          <dd>{stokGirisiEntity.user ? stokGirisiEntity.user.login : ''}</dd>
          <dt>
            <Translate contentKey="koopApp.stokGirisi.urun">Urun</Translate>
          </dt>
          <dd>{stokGirisiEntity.urun ? stokGirisiEntity.urun.urunAdi : ''}</dd>
        </dl>
        <Button tag={Link} to="/stok-girisi" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ stokGirisi }: IRootState) => ({
  stokGirisiEntity: stokGirisi.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(StokGirisiDetail);
