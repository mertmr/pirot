import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {RouteComponentProps} from 'react-router-dom';
import {Col, Label, Row, Table, Button} from 'reactstrap';
import {AvForm, AvGroup} from 'availity-reactstrap-validation';
import {getSortState, JhiItemCount, JhiPagination, TextFormat, Translate} from 'react-jhipster';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import {IRootState} from 'app/shared/reducers';
import {getEntities} from './ciro.reducer';
import {APP_DATE_FORMAT} from 'app/config/constants';
import {ITEMS_PER_PAGE} from 'app/shared/util/pagination.constants';
import {DatePicker} from "antd";
import moment from "moment";
import {defaultValue} from "app/shared/model/ciro.request.model";
import {convertDateTimeToServer} from "app/shared/util/date-utils";

export interface ICiroProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {
}

export const Ciro = (props: ICiroProps) => {
  const [paginationState, setPaginationState] = useState(getSortState(props.location, ITEMS_PER_PAGE));
  const [ciroRequest, setCiroRequest] = useState(defaultValue);

  const getAllEntities = () => {
    props.getEntities(null ,null);
  };

  useEffect(() => {
    getAllEntities();
  }, []);

  const sortEntities = () => {
    getAllEntities();
    props.history.push(
      `${props.location.pathname}?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`
    );
  };

  useEffect(() => {
    sortEntities();
  }, [paginationState.activePage, paginationState.order, paginationState.sort]);

  const sort = p => () => {
    setPaginationState({
      ...paginationState,
      order: paginationState.order === 'asc' ? 'desc' : 'asc',
      sort: p
    });
  };

  const handlePagination = currentPage =>
    setPaginationState({
      ...paginationState,
      activePage: currentPage
    });

  const updateToDate = (value, dateString) => {
    setCiroRequest({
      ...ciroRequest,
      ["to"]: dateString
    });
  };

  const updateFromDate = (value, dateString) => {
    setCiroRequest({
      ...ciroRequest,
      ["from"]: dateString
    });
  };

  const getCiroReport = () => {
    props.getEntities(ciroRequest.from, ciroRequest.to);
  };

  const {ciroList} = props;
  return (
    <div>
      <h2 id="ciro-heading">
        <Translate contentKey="koopApp.ciro.home.title">Ciro</Translate>
      </h2>
      <Row>
        <Col sm="12">
          <AvForm onSubmit={getCiroReport}>
            <AvGroup>
              <Label for="gider-user">
                Satış Tarihi
              </Label>
              <DatePicker name="from" className="form-control"
                          placeholder="Tarih Seçin"
                          onChange={updateFromDate}
                          defaultValue={moment(new Date(), 'YYYY-MM-DD')}/>
            </AvGroup>
            <AvGroup>
              <Label for="gider-user">
                Satış Tarihi
              </Label>
              <DatePicker name="to" className="form-control"
                          placeholder="Tarih Seçin"
                          onChange={updateToDate}
                          defaultValue={moment(new Date(), 'YYYY-MM-DD')}/>
            </AvGroup>
            <Button color="primary" id="search-ciro" type="submit">
              <FontAwesomeIcon icon="save"/>
              &nbsp;
              Arat
            </Button>
          </AvForm>
        </Col>
      </Row>
      <div className="table-responsive">
        {ciroList && ciroList.length > 0 ? (
          <Table responsive>
            <thead>
            <tr>
              <th className="hand">
                <Translate contentKey="koopApp.ciro.tarih">Tarih</Translate>
              </th>
              <th className="hand">
                <Translate contentKey="koopApp.ciro.tutar">Tutar</Translate>
              </th>
            </tr>
            </thead>
            <tbody>
            {ciroList.map((ciro, i) => (
              <tr key={`entity-${i}`}>
                <td>
                  <TextFormat type="date" value={ciro.tarih} format={APP_DATE_FORMAT}/>
                </td>
                <td>{ciro.tutar}</td>
              </tr>
            ))}
            </tbody>
          </Table>
        ) : (
          <div className="alert alert-warning">
            <Translate contentKey="koopApp.ciro.home.notFound">No Ciro found</Translate>
          </div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = ({ciro}: IRootState) => ({
  ciroList: ciro.entities
});

const mapDispatchToProps = {
  getEntities
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Ciro);
