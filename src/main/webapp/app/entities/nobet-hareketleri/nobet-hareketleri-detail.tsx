import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {Link, RouteComponentProps} from 'react-router-dom';
import {Button, Row, Col, Table} from 'reactstrap';
import {Translate, ICrudGetAction, TextFormat} from 'react-jhipster';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import {IRootState} from 'app/shared/reducers';
import {getEntity} from './nobet-hareketleri.reducer';
import {APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT} from 'app/config/constants';
import {getCirosByNobetciDate} from "app/reports/ciro/ciro.reducer";

export interface INobetHareketleriDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {
}

export const NobetHareketleriDetail = (props: INobetHareketleriDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const {nobetHareketleriEntity, ciro} = props;

  useEffect(() => {
    if (nobetHareketleriEntity.user)
      props.getCirosByNobetciDate(nobetHareketleriEntity.tarih.substring(0, 10), nobetHareketleriEntity.user.id);
  }, [nobetHareketleriEntity]);


  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate
            contentKey="koopApp.nobetHareketleri.detail.title">NobetHareketleri</Translate> [<b>{nobetHareketleriEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="notlar">
              <Translate contentKey="koopApp.nobetHareketleri.notlar">Notlar</Translate>
            </span>
          </dt>
          <dd>{nobetHareketleriEntity.notlar}</dd>
        </dl>
        <Row>
          <Col md="8">
            <Table striped responsive>
              <thead>
              <tr>
                <th>
                  Nöbetçi
                </th>
                <th>
                  Tarih
                </th>
                <th>
                  Toplam Tutar
                </th>
                <th>
                  Kartlı Satış
                </th>
                <th>
                  Nakit Satış
                </th>
              </tr>
              </thead>
              <tbody>
              <tr key={`ciro2`}>
                <td>
                  {ciro.nobetci}
                </td>
                <td>{<TextFormat value={ciro.tarih} type="date" format={APP_LOCAL_DATE_FORMAT}/>}</td>
                <td>
                  {ciro.tutar}
                </td>
                <td>
                  {ciro.kartli}
                </td>
                <td>
                  {ciro.nakit}
                </td>
              </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
        <Row>
          <Col md="8">
            <Table striped responsive>
              <thead>
              <tr>
                <th>
                  <Translate contentKey="koopApp.nobetHareketleri.kasa">Kasa</Translate>
                </th>
                <th>
                  <Translate contentKey="koopApp.nobetHareketleri.pirot">Pirot</Translate>
                </th>
                <th>
                  <Translate contentKey="koopApp.nobetHareketleri.fark">Fark</Translate>
                </th>
                <th>
                  <Translate contentKey="koopApp.nobetHareketleri.nobetSuresi">Nobet Suresi</Translate>
                </th>
              </tr>
              </thead>
              <tbody>
              <tr key={`ciro1`}>
                <td>
                  {nobetHareketleriEntity.kasa}
                </td>
                <td>
                  {nobetHareketleriEntity.pirot}
                </td>
                <td>
                  {nobetHareketleriEntity.fark}
                </td>
                <td>
                  {nobetHareketleriEntity.nobetSuresi}
                </td>
              </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
        <Button tag={Link} to="/nobet-hareketleri" replace color="info">
          <FontAwesomeIcon icon="arrow-left"/>{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/nobet-hareketleri/${nobetHareketleriEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt"/>{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({nobetHareketleri, ciroState}: IRootState) => ({
  nobetHareketleriEntity: nobetHareketleri.entity,
  ciro: ciroState.ciro,
});

const mapDispatchToProps = {getEntity, getCirosByNobetciDate};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(NobetHareketleriDetail);
