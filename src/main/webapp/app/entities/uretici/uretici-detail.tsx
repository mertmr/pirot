import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './uretici.reducer';
import { IUretici } from 'app/shared/model/uretici.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IUreticiDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const UreticiDetail = (props: IUreticiDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { ureticiEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="koopApp.uretici.detail.title">Uretici</Translate> [<b>{ureticiEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="adi">
              <Translate contentKey="koopApp.uretici.adi">Adi</Translate>
            </span>
          </dt>
          <dd>{ureticiEntity.adi}</dd>
          <dt>
            <span id="adres">
              <Translate contentKey="koopApp.uretici.adres">Adres</Translate>
            </span>
          </dt>
          <dd>{ureticiEntity.adres}</dd>
          <dt>
            <span id="bankaBilgileri">
              <Translate contentKey="koopApp.uretici.bankaBilgileri">Banka Bilgileri</Translate>
            </span>
          </dt>
          <dd>{ureticiEntity.bankaBilgileri}</dd>
          <dt>
            <span id="tarih">
              <Translate contentKey="koopApp.uretici.tarih">Tarih</Translate>
            </span>
          </dt>
          <dd>
            <TextFormat value={ureticiEntity.tarih} type="date" format={APP_DATE_FORMAT} />
          </dd>
          <dt>
            <Translate contentKey="koopApp.uretici.user">User</Translate>
          </dt>
          <dd>{ureticiEntity.user ? ureticiEntity.user.login : ''}</dd>
        </dl>
        <Button tag={Link} to="/uretici" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/uretici/${ureticiEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ uretici }: IRootState) => ({
  ureticiEntity: uretici.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(UreticiDetail);
