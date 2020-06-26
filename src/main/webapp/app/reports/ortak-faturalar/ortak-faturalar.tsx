import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { TextFormat, Translate } from 'react-jhipster';

import { IRootState } from 'app/shared/reducers';
import { APP_DATE_FORMAT } from 'app/config/constants';
import { Dropdown } from 'primereact/dropdown';
import { getOrtakFaturas, getReportDateList, setReportDate } from 'app/reports/ortak-faturalar/ortak-faturalar.reducer';

export interface IOrtakFaturalarPageProps extends StateProps, DispatchProps, RouteComponentProps<{}> {}

export const OrtakFaturalarPage = (props: IOrtakFaturalarPageProps) => {
  useEffect(() => {
    props.getReportDateList();
  }, []);

  useEffect(() => {
    props.getReportDateList();
  }, [props.reportDate]);

  const onChangeReportDate = evt => {
    props.setReportDate(evt.value.reportDate);
    props.getOrtakFaturas(evt.value.reportDate);
  };

  const { ortakFaturaKisiList, match, reportDateList, reportDate } = props;

  return (
    <div>
      <h2 id="OrtakFaturalar-page-heading">Ortak Faturalar</h2>
      <Dropdown
        value={reportDate}
        options={reportDateList}
        optionLabel="reportDate"
        onChange={onChangeReportDate}
        className="col-12 col-md-4"
        filterPlaceholder="Tarih"
        placeholder="Tarih seçiniz"
      />
      <div className="table-responsive">
        {ortakFaturaKisiList && ortakFaturaKisiList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand">
                  <Translate contentKey="global.field.id">ID</Translate>
                </th>
                <th className="hand">
                  <Translate contentKey="koopApp.kisiler.kisiAdi">Kisi Adi</Translate>
                </th>
                <th className="hand">
                  <Translate contentKey="koopApp.kisiler.notlar">Notlar</Translate>
                </th>
                <th className="hand">
                  <Translate contentKey="koopApp.kisiler.tarih">Tarih</Translate>
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {ortakFaturaKisiList.map((kisiler, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <Button tag={Link} to={`${match.url}/${kisiler.id}_${reportDate}`} color="link" size="sm">
                      {kisiler.id}
                    </Button>
                  </td>
                  <td>{kisiler.kisiAdi}</td>
                  <td>{kisiler.notlar}</td>
                  <td>
                    <TextFormat type="date" value={kisiler.tarih} format={APP_DATE_FORMAT} />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <div className="alert alert-warning"></div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  ortakFaturaKisiList: storeState.ortakFaturalarState.ortakFaturaKisiList,
  reportDateList: storeState.ortakFaturalarState.reportDateList,
  reportDate: storeState.ortakFaturalarState.reportDate,
});

const mapDispatchToProps = { getOrtakFaturas, getReportDateList, setReportDate };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(OrtakFaturalarPage);
