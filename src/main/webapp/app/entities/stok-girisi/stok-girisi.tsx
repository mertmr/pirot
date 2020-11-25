import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {Link, RouteComponentProps} from 'react-router-dom';
import {Button, Col, InputGroup, Row, Table} from 'reactstrap';
import {AvForm, AvGroup, AvInput} from 'availity-reactstrap-validation';
import {JhiItemCount, JhiPagination, TextFormat, Translate} from 'react-jhipster';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import {IRootState} from 'app/shared/reducers';
import {getEntities, searchStokGirisiByUrun} from './stok-girisi.reducer';
import {APP_DATE_FORMAT} from 'app/config/constants';
import {ITEMS_PER_PAGE} from 'app/shared/util/pagination.constants';
import {getSortState} from 'app/shared/util/pagination-utils';
import {overridePaginationStateWithQueryParams} from 'app/shared/util/entity-utils';

export interface IStokGirisiProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {
}

export const StokGirisi = (props: IStokGirisiProps) => {
  const [search, setSearch] = useState('');
  const handleSearch = event => setSearch(event.target.value);
  const [paginationState, setPaginationState] = useState(getSortState(props.location, ITEMS_PER_PAGE));

  const getAllEntities = () => {
    if (search && search !== '') {
      props.searchStokGirisiByUrun(
        search,
        paginationState.activePage - 1,
        paginationState.itemsPerPage,
        `${paginationState.sort},${paginationState.order}`
      );
    } else {
      props.getEntities(paginationState.activePage - 1, paginationState.itemsPerPage, `${paginationState.sort},${paginationState.order}`);
    }
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

  const startSearching = () => {
    if (paginationState.activePage === 1 && (search || search === '')) getAllEntities();
    else if (search) {
      setPaginationState({
        ...paginationState,
        activePage: 1,
      });
    }
  };

  const clear = () => {
    setSearch('');
    setPaginationState({
      ...paginationState,
      activePage: 1,
    });
  };

  const {stokGirisiList, match, loading, totalItems} = props;
  return (
    <div>
      <h2 id="stok-girisi-heading">
        <Translate contentKey="koopApp.stokGirisi.home.title">Stok Girisis</Translate>
        <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
          <FontAwesomeIcon icon="plus"/>
          &nbsp;
          <Translate contentKey="koopApp.stokGirisi.home.createLabel">Create new Stok Girisi</Translate>
        </Link>
      </h2>
      <Row className="col-12"
           style={{marginTop: '20px', marginRight: '0', paddingRight: '0', marginLeft: '0', paddingLeft: '0'}}>
        <Col className="col-12">
          <AvForm onSubmit={startSearching}>
            <AvGroup>
              <InputGroup>
                <AvInput type="text" name="search" value={search} onChange={handleSearch} placeholder="Ürüne Göre Ara"/>
                <Button className="input-group-addon">
                  <FontAwesomeIcon icon="search"/>
                </Button>
                <Button type="reset" className="input-group-addon" onClick={clear}>
                  <FontAwesomeIcon icon="trash"/>
                </Button>
              </InputGroup>
            </AvGroup>
          </AvForm>
        </Col>
      </Row>
      <div className="table-responsive">
        {stokGirisiList && stokGirisiList.length > 0 ? (
          <Table responsive>
            <thead>
            <tr>
              <th className="hand" onClick={sort('id')}>
                <Translate contentKey="global.field.id">ID</Translate> <FontAwesomeIcon icon="sort"/>
              </th>
              <th className="hand" onClick={sort('miktar')}>
                <Translate contentKey="koopApp.stokGirisi.miktar">Miktar</Translate> <FontAwesomeIcon icon="sort"/>
              </th>
              <th className="hand" onClick={sort('notlar')}>
                <Translate contentKey="koopApp.stokGirisi.notlar">Notlar</Translate> <FontAwesomeIcon icon="sort"/>
              </th>
              <th className="hand" onClick={sort('stokHareketiTipi')}>
                <Translate contentKey="koopApp.stokGirisi.stokHareketiTipi">Stok Hareketi Tipi</Translate>
                <FontAwesomeIcon icon="sort"/>
              </th>
              <th className="hand" onClick={sort('tarih')}>
                <Translate contentKey="koopApp.stokGirisi.tarih">Tarih</Translate> <FontAwesomeIcon icon="sort"/>
              </th>
              <th>
                <Translate contentKey="koopApp.stokGirisi.user">User</Translate> <FontAwesomeIcon icon="sort"/>
              </th>
              <th>
                <Translate contentKey="koopApp.stokGirisi.urun">Urun</Translate> <FontAwesomeIcon icon="sort"/>
              </th>
              <th/>
            </tr>
            </thead>
            <tbody>
            {stokGirisiList.map((stokGirisi, i) => (
              <tr key={`entity-${i}`}>
                <td>
                  <Button tag={Link} to={`${match.url}/${stokGirisi.id}`} color="link" size="sm">
                    {stokGirisi.id}
                  </Button>
                </td>
                <td>{stokGirisi.miktar}</td>
                <td>{stokGirisi.notlar}</td>
                <td>
                  <Translate contentKey={`koopApp.StokHareketiTipi.${stokGirisi.stokHareketiTipi}`}/>
                </td>
                <td>{stokGirisi.tarih ?
                  <TextFormat type="date" value={stokGirisi.tarih} format={APP_DATE_FORMAT}/> : null}</td>
                <td>{stokGirisi.user ? stokGirisi.user.login : ''}</td>
                <td>{stokGirisi.urun ?
                  <Link to={`urun/${stokGirisi.urun.id}`}>{stokGirisi.urun.urunAdi}</Link> : ''}</td>
                <td className="text-right">
                  <div className="btn-group flex-btn-group-container">
                    <Button tag={Link} to={`${match.url}/${stokGirisi.id}`} color="info" size="sm">
                      <FontAwesomeIcon icon="eye"/>{' '}
                      <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
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
              <Translate contentKey="koopApp.stokGirisi.home.notFound">No Stok Girisis found</Translate>
            </div>
          )
        )}
      </div>
      {props.totalItems ? (
        <div className={stokGirisiList && stokGirisiList.length > 0 ? '' : 'd-none'}>
          <Row className="justify-content-center">
            <JhiItemCount page={paginationState.activePage} total={totalItems}
                          itemsPerPage={paginationState.itemsPerPage} i18nEnabled/>
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

const mapStateToProps = ({stokGirisi}: IRootState) => ({
  stokGirisiList: stokGirisi.entities,
  loading: stokGirisi.loading,
  totalItems: stokGirisi.totalItems,
});

const mapDispatchToProps = {
  getEntities,
  searchStokGirisiByUrun
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(StokGirisi);
