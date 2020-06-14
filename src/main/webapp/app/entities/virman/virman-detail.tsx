import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './virman.reducer';
import { IVirman } from 'app/shared/model/virman.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IVirmanDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const VirmanDetail = (props: IVirmanDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { virmanEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="koopApp.virman.detail.title">Virman</Translate> [<b>{virmanEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="tutar">
              <Translate contentKey="koopApp.virman.tutar">Tutar</Translate>
            </span>
          </dt>
          <dd>{virmanEntity.tutar}</dd>
          <dt>
            <span id="notlar">
              <Translate contentKey="koopApp.virman.notlar">Notlar</Translate>
            </span>
          </dt>
          <dd>{virmanEntity.notlar}</dd>
          <dt>
            <span id="cikisHesabi">
              <Translate contentKey="koopApp.virman.cikisHesabi">Cikis Hesabi</Translate>
            </span>
          </dt>
          <dd>{virmanEntity.cikisHesabi}</dd>
          <dt>
            <span id="girisHesabi">
              <Translate contentKey="koopApp.virman.girisHesabi">Giris Hesabi</Translate>
            </span>
          </dt>
          <dd>{virmanEntity.girisHesabi}</dd>
          <dt>
            <span id="tarih">
              <Translate contentKey="koopApp.virman.tarih">Tarih</Translate>
            </span>
          </dt>
          <dd>{virmanEntity.tarih ? <TextFormat value={virmanEntity.tarih} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <Translate contentKey="koopApp.virman.user">User</Translate>
          </dt>
          <dd>{virmanEntity.user ? virmanEntity.user.login : ''}</dd>
        </dl>
        <Button tag={Link} to="/virman" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/virman/${virmanEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ virman }: IRootState) => ({
  virmanEntity: virman.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(VirmanDetail);
