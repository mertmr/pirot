import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getCirosByNobetci } from './ciro.reducer';
import { APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ICiroDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const CiroDetail = (props: ICiroDetailProps) => {
  useEffect(() => {
    props.getCirosByNobetci(props.match.params.id);
  }, []);

  const { ciros } = props;
  return (
    <Row>
      <Col md="8">
        <h2>Ciro Günlük Detayı</h2>
        {ciros && ciros.length > 0 ? (
          <Table striped responsive>
            <thead>
              <tr>
                <th>Nöbetçi</th>
                <th>Tarih</th>
                <th>Toplam Tutar</th>
                <th>Kartlı Satış</th>
                <th>Nakit Satış</th>
              </tr>
            </thead>
            <tbody>
              {ciros.map((ciro, i) => (
                <tr key={`ciro-${i}`}>
                  <td>{ciro.nobetci}</td>
                  <td>{<TextFormat value={ciro.tarih} type="date" format={APP_LOCAL_DATE_FORMAT} />}</td>
                  <td>{ciro.tutar}</td>
                  <td>{ciro.kartli}</td>
                  <td>{ciro.nakit}</td>
                </tr>
              ))}
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
  ciros: storeState.ciroState.ciros,
  totalItems: storeState.ciroState.totalItems,
});

const mapDispatchToProps = { getCirosByNobetci };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(CiroDetail);
