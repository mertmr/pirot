import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {RouteComponentProps} from 'react-router-dom';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField, Table, Label, Translate, Input } from 'availity-reactstrap-validation';
import {getSortState, JhiItemCount, JhiPagination, TextFormat} from 'react-jhipster';

import {FATURA_DATE_FORMAT} from 'app/config/constants';
import {ITEMS_PER_PAGE} from 'app/shared/util/pagination.constants';

import {IRootState} from 'app/shared/reducers';
import {getOrtakFaturas, getReportDateList} from './ortak-faturalar.reducer';

export interface IOrtakFaturalarPageProps extends StateProps, DispatchProps, RouteComponentProps<{}> {
}

export const OrtakFaturalarPage = (props: IOrtakFaturalarPageProps) => {

  const [reportDate, setReportDate] = useState();

  const onChangeReportDate = evt => {
    setReportDate(evt.target.value);
    props.getOrtakFaturas(evt.target.value)
  };

  const {ortakFaturalar, reportDateList} = props;

  return (
    <div>
      <h2 id="ortakFaturalar-page-heading">Ortak Faturalar</h2>
      <span>
        Fatura Dönemi
      </span>
      <Input type="date" value={reportDate} onChange={onChangeReportDate} name="reportDate" id="reportDate"/>
      <AvGroup>
        <Label for="stok-girisi-urun">
          <Translate contentKey="koopApp.stokGirisi.urun">Urun</Translate>
        </Label>
        <AvInput id="stok-girisi-urun" type="select" className="form-control" value={reportDate} name="urun.id" onChange={onChangeReportDate}>
          <option value="" key="0" />
          {reportDateList
            ? reportDateList.map(otherEntity => (
              <option value={otherEntity.id} key={otherEntity.id}>
                {otherEntity.id}
              </option>
            ))
            : null}
        </AvInput>
      </AvGroup>
      {ortakFaturalar && ortakFaturalar.length > 0 ? (
        <Table striped responsive>
          <thead>
          <tr>
            <th>
              Tarih
            </th>
            <th>
              Tutar
            </th>
          </tr>
          </thead>
          <tbody>
          {ortakFaturalar.map((ortakFatura, i) => (
            <tr key={`ortakFatura-${i}`}>
              <td>
                {ortakFatura.tutar}
              </td>
            </tr>
          ))}
          </tbody>
        </Table>
      ) : (
        <div className="alert alert-warning">
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  ortakFaturalar: storeState.ortakFaturalarState.ortakFaturas,
  reportDateList: storeState.ortakFaturalarState.reportDateList,
  totalItems: storeState.ciroState.totalItems
});

const mapDispatchToProps = {getOrtakFaturas, getReportDateList};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(OrtakFaturalarPage);
