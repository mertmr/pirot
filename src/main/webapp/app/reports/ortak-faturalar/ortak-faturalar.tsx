import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {Link, RouteComponentProps} from 'react-router-dom';
import {Button, Table} from 'reactstrap';
import {TextFormat, Translate} from 'react-jhipster';

import {IRootState} from 'app/shared/reducers';
import {APP_DATE_FORMAT} from 'app/config/constants';
import {Dropdown} from 'primereact/dropdown';
import {getOrtakFaturas, getReportDateList} from "app/reports/ortak-faturalar/ortak-faturalar.reducer";

export interface IOrtakFaturalarPageProps extends StateProps, DispatchProps, RouteComponentProps<{}> {
}

export const OrtakFaturalarPage = (props: IOrtakFaturalarPageProps) => {

  const [reportDate, setReportDate] = useState();

  useEffect(() => {
    props.getReportDateList();
  }, []);

  const onChangeReportDate = evt => {
    setReportDate(evt.value);
    props.getOrtakFaturas(evt.value.reportDate)
  };

  const {ortakFaturaKisiList, match, reportDateList} = props;

  return (
    <div>
      <h2 id="OrtakFaturalar-page-heading">OrtakFaturalar</h2>
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
              <th/>
            </tr>
            </thead>
            <tbody>
            {ortakFaturaKisiList.map((kisiler, i) => (
              <tr key={`entity-${i}`}>
                <td>
                  <Button tag={Link} to={`${match.url}/${kisiler.id}-${reportDate.reportDate}`} color="link" size="sm">
                    {kisiler.id}
                  </Button>
                </td>
                <td>{kisiler.kisiAdi}</td>
                <td>{kisiler.notlar}</td>
                <td>
                  <TextFormat type="date" value={kisiler.tarih} format={APP_DATE_FORMAT}/>
                </td>
              </tr>
            ))}
            </tbody>
          </Table>
        ) : (
          <div className="alert alert-warning">
            <Translate contentKey="koopApp.kisiler.home.notFound">No Kisilers found</Translate>
          </div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  ortakFaturaKisiList: storeState.ortakFaturalarState.ortakFaturaKisiList,
  reportDateList: storeState.ortakFaturalarState.reportDateList
});

const mapDispatchToProps = {getOrtakFaturas, getReportDateList};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(OrtakFaturalarPage);
