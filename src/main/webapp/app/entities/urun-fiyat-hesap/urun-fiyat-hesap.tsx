import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
import { Translate, ICrudGetAllAction, getSortState, IPaginationBaseState, JhiPagination, JhiItemCount } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './urun-fiyat-hesap.reducer';
import { IUrunFiyatHesap } from 'app/shared/model/urun-fiyat-hesap.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';

export interface IUrunFiyatHesapProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const UrunFiyatHesap = (props: IUrunFiyatHesapProps) => {
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

  const { urunFiyatHesapList, match, loading, totalItems } = props;
  return (
    <div>
      <h2 id="urun-fiyat-hesap-heading">
        <Translate contentKey="koopApp.urunFiyatHesap.home.title">Urun Fiyat Hesaps</Translate>
        <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
          <FontAwesomeIcon icon="plus" />
          &nbsp;
          <Translate contentKey="koopApp.urunFiyatHesap.home.createLabel">Create new Urun Fiyat Hesap</Translate>
        </Link>
      </h2>
      <div className="table-responsive">
        {urunFiyatHesapList && urunFiyatHesapList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th>
                  <Translate contentKey="koopApp.urunFiyatHesap.urun">Urun</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="global.field.id">ID</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('amortisman')}>
                  <Translate contentKey="koopApp.urunFiyatHesap.amortisman">Amortisman</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('giderPusulaMustahsil')}>
                  <Translate contentKey="koopApp.urunFiyatHesap.giderPusulaMustahsil">Gider Pusula Mustahsil</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('dukkanGider')}>
                  <Translate contentKey="koopApp.urunFiyatHesap.dukkanGider">Dukkan Gider</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('kooperatifCalisma')}>
                  <Translate contentKey="koopApp.urunFiyatHesap.kooperatifCalisma">Kooperatif Calisma</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('dayanisma')}>
                  <Translate contentKey="koopApp.urunFiyatHesap.dayanisma">Dayanisma</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('fire')}>
                  <Translate contentKey="koopApp.urunFiyatHesap.fire">Fire</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {urunFiyatHesapList.map((urunFiyatHesap, i) => (
                <tr key={`entity-${i}`}>
                  <td>{urunFiyatHesap.urun ? urunFiyatHesap.urun.urunAdi : ''}</td>
                  <td>
                    <Button tag={Link} to={`${match.url}/${urunFiyatHesap.id}`} color="link" size="sm">
                      {urunFiyatHesap.id}
                    </Button>
                  </td>
                  <td>{urunFiyatHesap.amortisman}</td>
                  <td>{urunFiyatHesap.giderPusulaMustahsil}</td>
                  <td>{urunFiyatHesap.dukkanGider}</td>
                  <td>{urunFiyatHesap.kooperatifCalisma}</td>
                  <td>{urunFiyatHesap.dayanisma}</td>
                  <td>{urunFiyatHesap.fire}</td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${urunFiyatHesap.id}`} color="info" size="sm">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`${match.url}/${urunFiyatHesap.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
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
                        to={`${match.url}/${urunFiyatHesap.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
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
              <Translate contentKey="koopApp.urunFiyatHesap.home.notFound">No Urun Fiyat Hesaps found</Translate>
            </div>
          )
        )}
      </div>
      <div className={urunFiyatHesapList && urunFiyatHesapList.length > 0 ? '' : 'd-none'}>
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

const mapStateToProps = ({ urunFiyatHesap }: IRootState) => ({
  urunFiyatHesapList: urunFiyatHesap.entities,
  loading: urunFiyatHesap.loading,
  totalItems: urunFiyatHesap.totalItems
});

const mapDispatchToProps = {
  getEntities
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(UrunFiyatHesap);