import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './uretici-odemeleri.reducer';
import { IUreticiOdemeleri } from 'app/shared/model/uretici-odemeleri.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IUreticiOdemeleriDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const UreticiOdemeleriDetail = (props: IUreticiOdemeleriDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { ureticiOdemeleriEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="koopApp.ureticiOdemeleri.detail.title">UreticiOdemeleri</Translate> [<b>{ureticiOdemeleriEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="tutar">
              <Translate contentKey="koopApp.ureticiOdemeleri.tutar">Tutar</Translate>
            </span>
          </dt>
          <dd>{ureticiOdemeleriEntity.tutar}</dd>
          <dt>
            <span id="sonGuncellenmeTarihi">
              <Translate contentKey="koopApp.ureticiOdemeleri.sonGuncellenmeTarihi">Son Guncellenme Tarihi</Translate>
            </span>
          </dt>
          <dd>
            {ureticiOdemeleriEntity.sonGuncellenmeTarihi ? (
              <TextFormat value={ureticiOdemeleriEntity.sonGuncellenmeTarihi} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <Translate contentKey="koopApp.ureticiOdemeleri.uretici">Uretici</Translate>
          </dt>
          <dd>{ureticiOdemeleriEntity.uretici ? ureticiOdemeleriEntity.uretici.adi : ''}</dd>
        </dl>
        <Button tag={Link} to="/uretici-odemeleri" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/uretici-odemeleri/${ureticiOdemeleriEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ ureticiOdemeleri }: IRootState) => ({
  ureticiOdemeleriEntity: ureticiOdemeleri.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(UreticiOdemeleriDetail);
