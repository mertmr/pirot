import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Col, Input, Row, Table } from 'reactstrap';

import { IRootState } from 'app/shared/reducers';
import { getCirosByNobetci } from 'app/reports/ciro/ciro.reducer';
import { getGunSonuRaporu } from 'app/entities/nobet-hareketleri/nobet-hareketleri.reducer';
import { TextFormat } from 'react-jhipster';
import { APP_DATE_FORMAT } from 'app/config/constants';

export interface IGunRaporuProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

const today = (): string => {
  // Today + 1 day - needed if the current day must be included
  const day: Date = new Date();
  day.setDate(day.getDate() + 1);
  const toDate = new Date(day.getFullYear(), day.getMonth(), day.getDate());
  return toDate.toISOString().slice(0, 10);
};

export const GunRaporu = (props: IGunRaporuProps) => {
  const [toDate, setToDate] = useState(today());

  const onChangeToDate = evt => {
    setToDate(evt.target.value);
  };

  useEffect(() => {
    props.getGunSonuRaporu(toDate);
  }, [toDate]);

  const { gunSonuRaporu } = props;
  return (
    <Row>
      <Col md="8">
        <h2 id="ciros-page-heading">Gün Sonu Raporu</h2>
        <span>Rapor Günü</span>
        <Input type="date" value={toDate} onChange={onChangeToDate} name="toDate" id="toDate" style={{ marginBottom: '20px' }} />
        <h5>Giderler</h5>
        {gunSonuRaporu.giderList && gunSonuRaporu.giderList.length > 0 ? (
          <Table striped responsive>
            <thead>
              <tr>
                <th>Gider Tutar</th>
                <th>Gider Not</th>
                <th>Gider Tipi</th>
              </tr>
            </thead>
            <tbody>
              {gunSonuRaporu.giderList.map((gider, i) => (
                <tr key={`gider-${i}`}>
                  <td>{gider.tutar}</td>
                  <td>{gider.notlar}</td>
                  <td>{gider.giderTipi}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <div className="alert alert-warning">Gider Yok</div>
        )}
        <h5>Virman</h5>
        {gunSonuRaporu.virman ? (
          <Table striped responsive>
            <thead>
              <tr>
                <th>Virman Tutar</th>
                <th>Virman Not</th>
                <th>Virmanı Alan</th>
              </tr>
            </thead>
            <tbody>
              <tr key={`virman`}>
                <td>{gunSonuRaporu.virman.tutar}</td>
                <td>{gunSonuRaporu.virman.notlar}</td>
                <td>{gunSonuRaporu.virman.user.login}</td>
              </tr>
            </tbody>
          </Table>
        ) : (
          <div className="alert alert-warning">Virman Yok</div>
        )}
        <h5>Ciro</h5>
        {gunSonuRaporu.dashboardReports ? (
          <Table striped responsive>
            <thead>
              <tr>
                <th>Pirot</th>
                <th>Toplam Satış</th>
                <th>Kartlı Satış</th>
                <th>Nakit Satış</th>
              </tr>
            </thead>
            <tbody>
              <tr key={`virman`}>
                <td>{gunSonuRaporu.dashboardReports.kasadaNeVar}</td>
                <td>{gunSonuRaporu.dashboardReports.gunlukCiro}</td>
                <td>{gunSonuRaporu.dashboardReports.kartliSatis}</td>
                <td>{gunSonuRaporu.dashboardReports.nakitSatis}</td>
              </tr>
            </tbody>
          </Table>
        ) : (
          <div className="alert alert-warning">Ciro Raporu Yok</div>
        )}
        <h5>Son Nöbet Hareketi Açılış</h5>
        {gunSonuRaporu.acilisHareketi ? (
          <Table striped responsive>
            <thead>
              <tr>
                <th>Kasa</th>
                <th>Pirot</th>
                <th>Fark</th>
                <th>Notlar</th>
                <th>Tarih Saat</th>
              </tr>
            </thead>
            <tbody>
              <tr key={`virman`}>
                <td>{gunSonuRaporu.acilisHareketi.kasa}</td>
                <td>{gunSonuRaporu.acilisHareketi.pirot}</td>
                <td>{gunSonuRaporu.acilisHareketi.fark}</td>
                <td>{gunSonuRaporu.acilisHareketi.notlar}</td>{' '}
                <td>
                  {gunSonuRaporu.acilisHareketi.tarih ? (
                    <TextFormat type="date" value={gunSonuRaporu.acilisHareketi.tarih} format={APP_DATE_FORMAT} />
                  ) : null}
                </td>
              </tr>
            </tbody>
          </Table>
        ) : (
          <div className="alert alert-warning"></div>
        )}
        <h5>Son Nöbet Hareketi Kapanış</h5>
        {gunSonuRaporu.nobetHareketleri ? (
          <Table striped responsive>
            <thead>
              <tr>
                <th>Kasa</th>
                <th>Pirot</th>
                <th>Fark</th>
                <th>Notlar</th>
                <th>Tarih Saat</th>
              </tr>
            </thead>
            <tbody>
              <tr key={`virman`}>
                <td>{gunSonuRaporu.nobetHareketleri.kasa}</td>
                <td>{gunSonuRaporu.nobetHareketleri.pirot}</td>
                <td>{gunSonuRaporu.nobetHareketleri.fark}</td>
                <td>{gunSonuRaporu.nobetHareketleri.notlar}</td>{' '}
                <td>
                  {gunSonuRaporu.nobetHareketleri.tarih ? (
                    <TextFormat type="date" value={gunSonuRaporu.nobetHareketleri.tarih} format={APP_DATE_FORMAT} />
                  ) : null}
                </td>
              </tr>
            </tbody>
          </Table>
        ) : (
          <div className="alert alert-warning"></div>
        )}
      </Col>
    </Row>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  gunSonuRaporu: storeState.nobetHareketleri.gunSonuRaporu,
});

const mapDispatchToProps = { getGunSonuRaporu };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(GunRaporu);
