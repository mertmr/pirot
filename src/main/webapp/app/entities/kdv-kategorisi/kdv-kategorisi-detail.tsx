import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './kdv-kategorisi.reducer';
import { IKdvKategorisi } from 'app/shared/model/kdv-kategorisi.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IKdvKategorisiDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const KdvKategorisiDetail = (props: IKdvKategorisiDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { kdvKategorisiEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="koopApp.kdvKategorisi.detail.title">KdvKategorisi</Translate> [<b>{kdvKategorisiEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="kategoriAdi">
              <Translate contentKey="koopApp.kdvKategorisi.kategoriAdi">Kategori Adi</Translate>
            </span>
          </dt>
          <dd>{kdvKategorisiEntity.kategoriAdi}</dd>
          <dt>
            <span id="kdvOrani">
              <Translate contentKey="koopApp.kdvKategorisi.kdvOrani">Kdv Orani</Translate>
            </span>
          </dt>
          <dd>{kdvKategorisiEntity.kdvOrani}</dd>
        </dl>
        <Button tag={Link} to="/kdv-kategorisi" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/kdv-kategorisi/${kdvKategorisiEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ kdvKategorisi }: IRootState) => ({
  kdvKategorisiEntity: kdvKategorisi.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(KdvKategorisiDetail);
