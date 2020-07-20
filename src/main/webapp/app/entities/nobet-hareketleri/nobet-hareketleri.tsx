import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
import { Translate, ICrudGetAllAction, TextFormat, getSortState, IPaginationBaseState, JhiPagination, JhiItemCount } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './nobet-hareketleri.reducer';
import { INobetHareketleri } from 'app/shared/model/nobet-hareketleri.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';

export interface INobetHareketleriProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const NobetHareketleri = (props: INobetHareketleriProps) => {
  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getSortState(props.location, ITEMS_PER_PAGE), props.location.search)
  );

  const getAllEntities = () => {
    props.getEntities(paginationState.activePage - 1, paginationState.itemsPerPage, `${paginationState.sort},${paginationState.order}`);
  };

  const sortEntities = () => {
    getAllEntities();
    const endURL = `?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`;
    if (props.location.search !== endURL) {
      props.history.push(`${props.location.pathname}${endURL}`);
    }
  };

  useEffect(() => {
    sortEntities();
  }, [paginationState.activePage, paginationState.order, paginationState.sort]);

  useEffect(() => {
    const params = new URLSearchParams(props.location.search);
    const page = params.get('page');
    const sort = params.get('sort');
    if (page && sort) {
      const sortSplit = sort.split(',');
      setPaginationState({
        ...paginationState,
        activePage: +page,
        sort: sortSplit[0],
        order: sortSplit[1],
      });
    }
  }, [props.location.search]);

  const sort = p => () => {
    setPaginationState({
      ...paginationState,
      order: paginationState.order === 'asc' ? 'desc' : 'asc',
      sort: p,
    });
  };

  const handlePagination = currentPage =>
    setPaginationState({
      ...paginationState,
      activePage: currentPage,
    });

  const { nobetHareketleriList, match, loading, totalItems } = props;
  return (
    <div>
      <h2 id="nobet-hareketleri-heading">
        <Translate contentKey="koopApp.nobetHareketleri.home.title">Nobet Hareketleris</Translate>
        <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
          <FontAwesomeIcon icon="plus" />
          &nbsp;
          <Translate contentKey="koopApp.nobetHareketleri.home.createLabel">Create new Nobet Hareketleri</Translate>
        </Link>
      </h2>
      <div className="table-responsive">
        {nobetHareketleriList && nobetHareketleriList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="global.field.id">ID</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('kasa')}>
                  <Translate contentKey="koopApp.nobetHareketleri.kasa">Kasa</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('pirot')}>
                  <Translate contentKey="koopApp.nobetHareketleri.pirot">Pirot</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('fark')}>
                  <Translate contentKey="koopApp.nobetHareketleri.fark">Fark</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('nobetSuresi')}>
                  <Translate contentKey="koopApp.nobetHareketleri.nobetSuresi">Nobet Suresi</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('notlar')}>
                  <Translate contentKey="koopApp.nobetHareketleri.notlar">Notlar</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('acilisKapanis')}>
                  <Translate contentKey="koopApp.nobetHareketleri.acilisKapanis">Acilis Kapanis</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('tarih')}>
                  <Translate contentKey="koopApp.nobetHareketleri.tarih">Tarih</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  <Translate contentKey="koopApp.nobetHareketleri.user">User</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {nobetHareketleriList.map((nobetHareketleri, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <Button tag={Link} to={`${match.url}/${nobetHareketleri.id}`} color="link" size="sm">
                      {nobetHareketleri.id}
                    </Button>
                  </td>
                  <td>{nobetHareketleri.kasa}</td>
                  <td>{nobetHareketleri.pirot}</td>
                  <td>{nobetHareketleri.fark}</td>
                  <td>{nobetHareketleri.nobetSuresi}</td>
                  <td>{nobetHareketleri.notlar}</td>
                  <td>
                    <Translate contentKey={`koopApp.AcilisKapanis.${nobetHareketleri.acilisKapanis}`} />
                  </td>
                  <td>
                    {nobetHareketleri.tarih ? <TextFormat type="date" value={nobetHareketleri.tarih} format={APP_DATE_FORMAT} /> : null}
                  </td>
                  <td>{nobetHareketleri.user ? nobetHareketleri.user.login : ''}</td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${nobetHareketleri.id}`} color="info" size="sm">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`${match.url}/${nobetHareketleri.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                        color="primary"
                        size="sm"
                      >
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`${match.url}/${nobetHareketleri.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                        color="danger"
                        size="sm"
                      >
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
          !loading && (
            <div className="alert alert-warning">
              <Translate contentKey="koopApp.nobetHareketleri.home.notFound">No Nobet Hareketleris found</Translate>
            </div>
          )
        )}
      </div>
      {props.totalItems ? (
        <div className={nobetHareketleriList && nobetHareketleriList.length > 0 ? '' : 'd-none'}>
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
      ) : (
        ''
      )}
    </div>
  );
};

const mapStateToProps = ({ nobetHareketleri }: IRootState) => ({
  nobetHareketleriList: nobetHareketleri.entities,
  loading: nobetHareketleri.loading,
  totalItems: nobetHareketleri.totalItems,
});

const mapDispatchToProps = {
  getEntities,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(NobetHareketleri);
