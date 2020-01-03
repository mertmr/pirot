import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
import { Translate, ICrudGetAllAction, getSortState, IPaginationBaseState } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities, reset } from './satis-stok-hareketleri.reducer';
import { ISatisStokHareketleri } from 'app/shared/model/satis-stok-hareketleri.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';

export interface ISatisStokHareketleriProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const SatisStokHareketleri = (props: ISatisStokHareketleriProps) => {
  const [paginationState, setPaginationState] = useState(getSortState(props.location, ITEMS_PER_PAGE));
  const [sorting, setSorting] = useState(false);

  const getAllEntities = () => {
    props.getEntities(paginationState.activePage - 1, paginationState.itemsPerPage, `${paginationState.sort},${paginationState.order}`);
  };

  const resetAll = () => {
    props.reset();
    setPaginationState({
      ...paginationState,
      activePage: 1
    });
  };

  useEffect(() => {
    resetAll();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      getAllEntities();
    }
  });

  useEffect(() => {
    getAllEntities();
  }, [paginationState.activePage]);

  const handleLoadMore = () => {
    if (window.pageYOffset > 0) {
      setPaginationState({
        ...paginationState,
        activePage: paginationState.activePage + 1
      });
    }
  };

  useEffect(() => {
    if (sorting) {
      getAllEntities();
      setSorting(false);
    }
  }, [sorting]);

  const sort = p => () => {
    props.reset();
    setPaginationState({
      ...paginationState,
      activePage: 1,
      order: paginationState.order === 'asc' ? 'desc' : 'asc',
      sort: p
    });
    setSorting(true);
  };

  const { satisStokHareketleriList, match } = props;
  return (
    <div>
      <h2 id="satis-stok-hareketleri-heading">
        <Translate contentKey="koopApp.satisStokHareketleri.home.title">Satis Stok Hareketleris</Translate>
        <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
          <FontAwesomeIcon icon="plus" />
          &nbsp;
          <Translate contentKey="koopApp.satisStokHareketleri.home.createLabel">Create new Satis Stok Hareketleri</Translate>
        </Link>
      </h2>
      <div className="table-responsive">
        <InfiniteScroll
          pageStart={paginationState.activePage}
          loadMore={handleLoadMore}
          hasMore={paginationState.activePage - 1 < props.links.next}
          loader={<div className="loader">Loading ...</div>}
          threshold={0}
          initialLoad={false}
        >
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
                        <Link to={`urun/${satisStokHareketleri.urun.id}`}>{satisStokHareketleri.urun.id}</Link>
                      ) : (
                        ''
                      )}
                    </td>
                    <td className="text-right">
                      <div className="btn-group flex-btn-group-container">
                        <Button tag={Link} to={`${match.url}/${satisStokHareketleri.id}`} color="info" size="sm">
                          <FontAwesomeIcon icon="eye" />{' '}
                          <span className="d-none d-md-inline">
                            <Translate contentKey="entity.action.view">View</Translate>
                          </span>
                        </Button>
                        <Button tag={Link} to={`${match.url}/${satisStokHareketleri.id}/edit`} color="primary" size="sm">
                          <FontAwesomeIcon icon="pencil-alt" />{' '}
                          <span className="d-none d-md-inline">
                            <Translate contentKey="entity.action.edit">Edit</Translate>
                          </span>
                        </Button>
                        <Button tag={Link} to={`${match.url}/${satisStokHareketleri.id}/delete`} color="danger" size="sm">
                          <FontAwesomeIcon icon="trash" />{' '}
                          <span className="d-none d-md-inline">
                            <Translate contentKey="entity.action.delete">Delete</Translate>
                          </span>
                        </Button>
                      </div>
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
        </InfiniteScroll>
      </div>
    </div>
  );
};

const mapStateToProps = ({ satisStokHareketleri }: IRootState) => ({
  satisStokHareketleriList: satisStokHareketleri.entities,
  totalItems: satisStokHareketleri.totalItems,
  links: satisStokHareketleri.links,
  entity: satisStokHareketleri.entity,
  updateSuccess: satisStokHareketleri.updateSuccess
});

const mapDispatchToProps = {
  getEntities,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(SatisStokHareketleri);
