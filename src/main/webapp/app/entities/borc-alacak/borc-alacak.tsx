import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
import { Translate, ICrudGetAllAction, TextFormat, getSortState, IPaginationBaseState, JhiPagination, JhiItemCount } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './borc-alacak.reducer';
import { IBorcAlacak } from 'app/shared/model/borc-alacak.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';

export interface IBorcAlacakProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const BorcAlacak = (props: IBorcAlacakProps) => {
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

  const { borcAlacakList, match, totalItems } = props;
  return (
    <div>
      <h2 id="borc-alacak-heading">
        <Translate contentKey="koopApp.borcAlacak.home.title">Borc Alacaks</Translate>
        <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
          <FontAwesomeIcon icon="plus" />
          &nbsp;
          <Translate contentKey="koopApp.borcAlacak.home.createLabel">Create new Borc Alacak</Translate>
        </Link>
      </h2>
      <div className="table-responsive">
        {borcAlacakList && borcAlacakList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="global.field.id">ID</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('tutar')}>
                  <Translate contentKey="koopApp.borcAlacak.tutar">Tutar</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('notlar')}>
                  <Translate contentKey="koopApp.borcAlacak.notlar">Notlar</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('odemeAraci')}>
                  <Translate contentKey="koopApp.borcAlacak.odemeAraci">Odeme Araci</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('hareketTipi')}>
                  <Translate contentKey="koopApp.borcAlacak.hareketTipi">Hareket Tipi</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('tarih')}>
                  <Translate contentKey="koopApp.borcAlacak.tarih">Tarih</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  <Translate contentKey="koopApp.borcAlacak.user">User</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  <Translate contentKey="koopApp.borcAlacak.urun">Urun</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {borcAlacakList.map((borcAlacak, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <Button tag={Link} to={`${match.url}/${borcAlacak.id}`} color="link" size="sm">
                      {borcAlacak.id}
                    </Button>
                  </td>
                  <td>{borcAlacak.tutar}</td>
                  <td>{borcAlacak.notlar}</td>
                  <td>
                    <Translate contentKey={`koopApp.OdemeAraci.${borcAlacak.odemeAraci}`} />
                  </td>
                  <td>
                    <Translate contentKey={`koopApp.HareketTipi.${borcAlacak.hareketTipi}`} />
                  </td>
                  <td>
                    <TextFormat type="date" value={borcAlacak.tarih} format={APP_DATE_FORMAT} />
                  </td>
                  <td>{borcAlacak.user ? borcAlacak.user.login : ''}</td>
                  <td>{borcAlacak.urun ? <Link to={`urun/${borcAlacak.urun.id}`}>{borcAlacak.urun.urunAdi}</Link> : ''}</td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${borcAlacak.id}`} color="info" size="sm">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`${match.url}/${borcAlacak.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
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
                        to={`${match.url}/${borcAlacak.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
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
          <div className="alert alert-warning">
            <Translate contentKey="koopApp.borcAlacak.home.notFound">No Borc Alacaks found</Translate>
          </div>
        )}
      </div>
      <div className={borcAlacakList && borcAlacakList.length > 0 ? '' : 'd-none'}>
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

const mapStateToProps = ({ borcAlacak }: IRootState) => ({
  borcAlacakList: borcAlacak.entities,
  totalItems: borcAlacak.totalItems
});

const mapDispatchToProps = {
  getEntities
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(BorcAlacak);
