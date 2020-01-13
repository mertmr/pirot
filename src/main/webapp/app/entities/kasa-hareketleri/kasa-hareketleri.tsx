import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
import { Translate, ICrudGetAllAction, TextFormat, getSortState, IPaginationBaseState, JhiPagination, JhiItemCount } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './kasa-hareketleri.reducer';
import { IKasaHareketleri } from 'app/shared/model/kasa-hareketleri.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import {getSortStateByIdDesc} from "app/shared/util/pagination-utils";

export interface IKasaHareketleriProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const KasaHareketleri = (props: IKasaHareketleriProps) => {
  const [paginationState, setPaginationState] = useState(getSortStateByIdDesc(props.location, ITEMS_PER_PAGE));

  const getAllEntities = () => {
    props.getEntities(paginationState.activePage - 1, paginationState.itemsPerPage, `${paginationState.sort},${paginationState.order}`);
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

  const { kasaHareketleriList, match, totalItems } = props;
  return (
    <div>
      <h2 id="kasa-hareketleri-heading">
        <Translate contentKey="koopApp.kasaHareketleri.home.title">Kasa Hareketleris</Translate>
      </h2>
      <div className="table-responsive">
        {kasaHareketleriList && kasaHareketleriList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="global.field.id">ID</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('kasaMiktar')}>
                  <Translate contentKey="koopApp.kasaHareketleri.kasaMiktar">Kasa Miktar</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('hareket')}>
                  <Translate contentKey="koopApp.kasaHareketleri.hareket">Hareket</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('tarih')}>
                  <Translate contentKey="koopApp.kasaHareketleri.tarih">Tarih</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {kasaHareketleriList.map((kasaHareketleri, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <Button tag={Link} to={`${match.url}/${kasaHareketleri.id}`} color="link" size="sm">
                      {kasaHareketleri.id}
                    </Button>
                  </td>
                  <td>{kasaHareketleri.kasaMiktar}</td>
                  <td>{kasaHareketleri.hareket}</td>
                  <td>
                    <TextFormat type="date" value={kasaHareketleri.tarih} format={APP_DATE_FORMAT} />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <div className="alert alert-warning">
            <Translate contentKey="koopApp.kasaHareketleri.home.notFound">No Kasa Hareketleris found</Translate>
          </div>
        )}
      </div>
      <div className={kasaHareketleriList && kasaHareketleriList.length > 0 ? '' : 'd-none'}>
        <Row className="justify-content-center">
          <JhiItemCount page={paginationState.activePage} total={totalItems} itemsPerPage={paginationState.itemsPerPage} i18nEnabled />
        </Row>
        <Row className="justify-content-center">
          <JhiPagination
            activePage={paginationState.activePage}
            onSelect={handlePagination}
            maxButtons={5}
            itemsPerPage={paginationState.itemsPerPage}
            totalItems={props.totalItems}
          />
        </Row>
      </div>
    </div>
  );
};

const mapStateToProps = ({ kasaHareketleri }: IRootState) => ({
  kasaHareketleriList: kasaHareketleri.entities,
  totalItems: kasaHareketleri.totalItems
});

const mapDispatchToProps = {
  getEntities
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(KasaHareketleri);
