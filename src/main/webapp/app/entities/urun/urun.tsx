import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
import { Translate, ICrudGetAllAction, getSortState, IPaginationBaseState, JhiPagination, JhiItemCount } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './urun.reducer';
import { IUrun } from 'app/shared/model/urun.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';

export interface IUrunProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const Urun = (props: IUrunProps) => {
  const [paginationState, setPaginationState] = useState(getSortState(props.location, ITEMS_PER_PAGE));

  const getAllEntities = () => {
    props.getEntities(paginationState.activePage - 1, paginationState.itemsPerPage, `${paginationState.sort},${paginationState.order}`);
  };

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

  const { urunList, match, loading, totalItems } = props;
  return (
    <div>
      <h2 id="urun-heading">
        <Translate contentKey="koopApp.urun.home.title">Uruns</Translate>
        <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
          <FontAwesomeIcon icon="plus" />
          &nbsp;
          <Translate contentKey="koopApp.urun.home.createLabel">Create new Urun</Translate>
        </Link>
      </h2>
      <div className="table-responsive">
        {urunList && urunList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="global.field.id">ID</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('urunAdi')}>
                  <Translate contentKey="koopApp.urun.urunAdi">Urun Adi</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('stok')}>
                  <Translate contentKey="koopApp.urun.stok">Stok</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('stokSiniri')}>
                  <Translate contentKey="koopApp.urun.stokSiniri">Stok Siniri</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('musteriFiyati')}>
                  <Translate contentKey="koopApp.urun.musteriFiyati">Musteri Fiyati</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('birim')}>
                  <Translate contentKey="koopApp.urun.birim">Birim</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('dayanismaUrunu')}>
                  <Translate contentKey="koopApp.urun.dayanismaUrunu">Dayanisma Urunu</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('satista')}>
                  <Translate contentKey="koopApp.urun.satista">Satista</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('urunKategorisi')}>
                  <Translate contentKey="koopApp.urun.urunKategorisi">Urun Kategorisi</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('active')}>
                  <Translate contentKey="koopApp.urun.active">Active</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  <Translate contentKey="koopApp.urun.urunSorumlusu">Urun Sorumlusu</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  <Translate contentKey="koopApp.urun.kdvKategorisi">Kdv Kategorisi</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {urunList.map((urun, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <Button tag={Link} to={`${match.url}/${urun.id}`} color="link" size="sm">
                      {urun.id}
                    </Button>
                  </td>
                  <td>{urun.urunAdi}</td>
                  <td>{urun.stok}</td>
                  <td>{urun.stokSiniri}</td>
                  <td>{urun.musteriFiyati}</td>
                  <td>
                    <Translate contentKey={`koopApp.Birim.${urun.birim}`} />
                  </td>
                  <td>{urun.dayanismaUrunu ? 'true' : 'false'}</td>
                  <td>{urun.satista ? 'true' : 'false'}</td>
                  <td>
                    <Translate contentKey={`koopApp.UrunKategorisi.${urun.urunKategorisi}`} />
                  </td>
                  <td>{urun.active ? 'true' : 'false'}</td>
                  <td>{urun.urunSorumlusu ? urun.urunSorumlusu.login : ''}</td>
                  <td>{urun.kdvKategorisi ? <Link to={`kdv-kategorisi/${urun.kdvKategorisi.id}`}>{urun.kdvKategorisi.id}</Link> : ''}</td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${urun.id}`} color="info" size="sm">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`${match.url}/${urun.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
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
                        to={`${match.url}/${urun.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
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
              <Translate contentKey="koopApp.urun.home.notFound">No Uruns found</Translate>
            </div>
          )
        )}
      </div>
      <div className={urunList && urunList.length > 0 ? '' : 'd-none'}>
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

const mapStateToProps = ({ urun }: IRootState) => ({
  urunList: urun.entities,
  loading: urun.loading,
  totalItems: urun.totalItems
});

const mapDispatchToProps = {
  getEntities
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Urun);
