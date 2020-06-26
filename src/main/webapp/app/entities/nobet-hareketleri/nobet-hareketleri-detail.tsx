import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity, getNobetciHareketiAcilis } from './nobet-hareketleri.reducer';
import { APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { getCirosByNobetciDate } from 'app/reports/ciro/ciro.reducer';
import { AcilisKapanis } from 'app/shared/model/enumerations/acilis-kapanis.model';
import { getVirmanUser } from 'app/entities/virman/virman.reducer';
import { getUserGiders } from 'app/entities/gider/gider.reducer';

export interface INobetHareketleriDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const NobetHareketleriDetail = (props: INobetHareketleriDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { nobetHareketleriEntity, ciro, virman, giderList, acilisHareketi } = props;

  useEffect(() => {
    if (nobetHareketleriEntity.user) {
      props.getCirosByNobetciDate(nobetHareketleriEntity.tarih.substring(0, 10), nobetHareketleriEntity.user.id);
      props.getVirmanUser(nobetHareketleriEntity.tarih.substring(0, 10), nobetHareketleriEntity.user.id);
      props.getUserGiders(nobetHareketleriEntity.tarih.substring(0, 10), nobetHareketleriEntity.user.id);
      props.getNobetciHareketiAcilis(nobetHareketleriEntity.tarih.substring(0, 10), nobetHareketleriEntity.user.id);
    }
  }, [nobetHareketleriEntity]);

  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="koopApp.nobetHareketleri.detail.title">NobetHareketleri</Translate> [<b>{nobetHareketleriEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="notlar">
              <Translate contentKey="koopApp.nobetHareketleri.notlar">Notlar</Translate>
            </span>
          </dt>
          <dd>{nobetHareketleriEntity.notlar}</dd>
          <dt>
            <span id="user">
              <Translate contentKey="koopApp.nobetHareketleri.user">Kullanıcı</Translate>
            </span>
          </dt>
          <dd>{nobetHareketleriEntity.user ? nobetHareketleriEntity.user.login : ''}</dd>
        </dl>
        {nobetHareketleriEntity.acilisKapanis === AcilisKapanis.ACILIS ? (
          <p>Açılış Hareketlerinde Ciro Gösterimi Yok</p>
        ) : (
          <Row>
            {giderList && giderList.length > 0 ? (
              <Col md="8">
                <h4>Gider</h4>
                <Table striped responsive>
                  <thead>
                    <tr>
                      <th>Gider Tutar</th>
                      <th>Gider Tipi</th>
                      <th>Gider Not</th>
                    </tr>
                  </thead>
                  <tbody>
                    {giderList.map((gider, i) => (
                      <tr key={`ciro-${i}`}>
                        <td>{gider.tutar}</td>
                        <td>{gider.giderTipi}</td>
                        <td>{gider.notlar}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
            ) : (
              <p />
            )}
            <Col md="8">
              <h4>Ciro</h4>
              <Table striped responsive>
                <thead>
                  <tr>
                    <th>Tarih</th>
                    <th>Toplam Tutar</th>
                    <th>Kartlı Satış</th>
                    <th>Nakit Satış</th>
                  </tr>
                </thead>
                <tbody>
                  <tr key={`ciro2`}>
                    <td>{<TextFormat value={ciro.tarih} type="date" format={APP_LOCAL_DATE_FORMAT} />}</td>
                    <td>{ciro.tutar}</td>
                    <td>{ciro.kartli}</td>
                    <td>{ciro.nakit}</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
            {!virman ? (
              <p />
            ) : (
              <Col md="8">
                <h4>Virman</h4>
                <Table striped responsive>
                  <thead>
                    <tr>
                      <th>Virman Tutar</th>
                      <th>Virman Notu</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr key={`virman`}>
                      <td>{virman.tutar}</td>
                      <td>{virman.notlar}</td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
            )}
          </Row>
        )}
        <Row>
          <Col md="8">
            <h4>Açılış Nöbetçi Kasası</h4>
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
                  <td>{acilisHareketi.kasa}</td>
                  <td>{acilisHareketi.pirot}</td>
                  <td>{acilisHareketi.fark}</td>
                  <td>{acilisHareketi.nobetSuresi} Saat</td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
        <Row>
          <Col md="8">
            <h4>Kapanış Nöbetçi Kasası</h4>
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
                  <td>{nobetHareketleriEntity.kasa}</td>
                  <td>{nobetHareketleriEntity.pirot}</td>
                  <td>{nobetHareketleriEntity.fark}</td>
                  <td>{nobetHareketleriEntity.nobetSuresi} Saat</td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
        <Button tag={Link} to="/nobet-hareketleri" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/nobet-hareketleri/${nobetHareketleriEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ nobetHareketleri, ciroState, virman, gider }: IRootState) => ({
  nobetHareketleriEntity: nobetHareketleri.entity,
  acilisHareketi: nobetHareketleri.acilisHareketi,
  ciro: ciroState.ciro,
  virman: virman.entity,
  giderList: gider.entities,
});

const mapDispatchToProps = { getEntity, getCirosByNobetciDate, getVirmanUser, getUserGiders, getNobetciHareketiAcilis };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(NobetHareketleriDetail);
