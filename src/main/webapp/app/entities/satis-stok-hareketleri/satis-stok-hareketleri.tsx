import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
import { Translate, ICrudGetAllAction,JhiPagination, JhiItemCount } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './satis-stok-hareketleri.reducer';
import { ISatisStokHareketleri } from 'app/shared/model/satis-stok-hareketleri.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import { getSortState, IPaginationBaseState } from 'app/shared/util/pagination-utils';

export interface ISatisStokHareketleriProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const SatisStokHareketleri = (props: ISatisStokHareketleriProps) => {
  const [paginationState, setPaginationState] = useState(getSortState(props.location, ITEMS_PER_PAGE));

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

  const { satisStokHareketleriList, match, totalItems } = props;
  return (
    <div>
      <h2 id="satis-stok-hareketleri-heading">
        <Translate contentKey="koopApp.satisStokHareketleri.home.title">Satis Stok Hareketleris</Translate>
      </h2>
      <div className="table-responsive">
        {satisStokHareketleriList && satisStokHareketleriList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="global.field.id">ID</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('miktar')}>
                  <Translate contentKey="koopApp.satisStokHareketleri.miktar">Miktar</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('tutar')}>
                  <Translate contentKey="koopApp.satisStokHareketleri.tutar">Tutar</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  <Translate contentKey="koopApp.satisStokHareketleri.satis">Satis</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  <Translate contentKey="koopApp.satisStokHareketleri.urun">Urun</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {satisStokHareketleriList.map((satisStokHareketleri, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <Button tag={Link} to={`${match.url}/${satisStokHareketleri.id}`} color="link" size="sm">
                      {satisStokHareketleri.id}
                    </Button>
                  </td>
                  <td>{satisStokHareketleri.miktar}</td>
                  <td>{satisStokHareketleri.tutar}</td>
                  <td>
                    {satisStokHareketleri.satis ? (
                      <Link to={`satis/${satisStokHareketleri.satis.id}`}>{satisStokHareketleri.satis.id}</Link>
                    ) : (
                      ''
                    )}
                  </td>
                  <td>
                    {satisStokHareketleri.urun ? (
                      <Link to={`urun/${satisStokHareketleri.urun.id}`}>{satisStokHareketleri.urun.urunAdi}</Link>
                    ) : (
                      ''
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <div className="alert alert-warning">
            <Translate contentKey="koopApp.satisStokHareketleri.home.notFound">No Satis Stok Hareketleris found</Translate>
          </div>
        )}
      </div>
      <div className={satisStokHareketleriList && satisStokHareketleriList.length > 0 ? '' : 'd-none'}>
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

const mapStateToProps = ({ satisStokHareketleri }: IRootState) => ({
  satisStokHareketleriList: satisStokHareketleri.entities,
  totalItems: satisStokHareketleri.totalItems
});

const mapDispatchToProps = {
  getEntities
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(SatisStokHareketleri);
