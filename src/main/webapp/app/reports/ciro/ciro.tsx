import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {RouteComponentProps} from 'react-router-dom';
import {Input, Row, Table} from 'reactstrap';
import {getSortState, JhiItemCount, JhiPagination, TextFormat, Translate} from 'react-jhipster';

import {APP_LOCAL_DATE_FORMAT} from 'app/config/constants';
import {ITEMS_PER_PAGE} from 'app/shared/util/pagination.constants';

import {IRootState} from 'app/shared/reducers';
import {getCiros} from './ciro.reducer';

export interface ICirosPageProps extends StateProps, DispatchProps, RouteComponentProps<{}> {
}

const previousMonth = (): string => {
  const now: Date = new Date();
  const fromDate =
    now.getMonth() === 0
      ? new Date(now.getFullYear() - 1, 11, now.getDate())
      : new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
  return fromDate.toISOString().slice(0, 10);
};

const today = (): string => {
  // Today + 1 day - needed if the current day must be included
  const day: Date = new Date();
  day.setDate(day.getDate() + 1);
  const toDate = new Date(day.getFullYear(), day.getMonth(), day.getDate());
  return toDate.toISOString().slice(0, 10);
};

export const CirosPage = (props: ICirosPageProps) => {
  const [pagination, setPagination] = useState(getSortState(props.location, ITEMS_PER_PAGE));
  const [fromDate, setFromDate] = useState(previousMonth());
  const [toDate, setToDate] = useState(today());

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    getAllCiros();
  }, [fromDate, toDate, pagination.activePage, pagination.order, pagination.sort]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    transition();
  }, [pagination.activePage, pagination.order, pagination.sort]);

  const onChangeFromDate = evt => setFromDate(evt.target.value);

  const onChangeToDate = evt => setToDate(evt.target.value);

  const sort = p => () =>
    setPagination({
      ...pagination,
      order: pagination.order === 'asc' ? 'desc' : 'asc',
      sort: p
    });

  const transition = () => {
    props.history.push(`${props.location.pathname}?page=${pagination.activePage}&sort=${pagination.sort},${pagination.order}`);
  };

  const handlePagination = currentPage =>
    setPagination({
      ...pagination,
      activePage: currentPage
    });

  const getAllCiros = () => {
    props.getCiros(pagination.activePage - 1, pagination.itemsPerPage, `${pagination.sort},${pagination.order}`, fromDate, toDate);
  };

  const {ciros, totalItems} = props;

  return (
    <div>
      <h2 id="ciros-page-heading">Ciros</h2>
      <span>
        Başlangıç Tarihi
      </span>
      <Input type="date" value={fromDate} onChange={onChangeFromDate} name="fromDate" id="fromDate"/>
      <span>
       Bitiş Tarihi
      </span>
      <Input type="date" value={toDate} onChange={onChangeToDate} name="toDate" id="toDate"/>
      {ciros && ciros.length > 0 ? (
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
          {ciros.map((ciro, i) => (
            <tr key={`ciro-${i}`}>
              <td>{<TextFormat value={ciro.tarih} type="date" format={APP_LOCAL_DATE_FORMAT}/>}</td>
              <td>
                {ciro.tutar}
              </td>
            </tr>
          ))}
          </tbody>
        </Table>
      ) : (
        <div className="alert alert-warning">
        </div>
      )}
      <div className={ciros && ciros.length > 0 ? '' : 'd-none'}>
        <Row className="justify-content-center">
          <JhiItemCount page={pagination.activePage} total={totalItems} itemsPerPage={pagination.itemsPerPage}
                        i18nEnabled/>
        </Row>
        <Row className="justify-content-center">
          <JhiPagination
            activePage={pagination.activePage}
            onSelect={handlePagination}
            maxButtons={5}
            itemsPerPage={pagination.itemsPerPage}
            totalItems={props.totalItems}
          />
        </Row>
      </div>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  ciros: storeState.reportState.ciros,
  totalItems: storeState.reportState.totalItems
});

const mapDispatchToProps = {getCiros};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(CirosPage);
