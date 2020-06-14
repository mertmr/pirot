import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {Link, RouteComponentProps} from 'react-router-dom';
import {Button, Col, InputGroup, Row, Table} from 'reactstrap';
import {AvForm, AvGroup, AvInput} from 'availity-reactstrap-validation';
import {JhiItemCount, JhiPagination, TextFormat, Translate} from 'react-jhipster';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { Checkbox } from 'antd';

import {IRootState} from 'app/shared/reducers';
import {getEntities, getSearchEntities} from './satis.reducer';
import {APP_DATE_FORMAT} from 'app/config/constants';
import {ITEMS_PER_PAGE} from 'app/shared/util/pagination.constants';
import {getSortState} from 'app/shared/util/pagination-utils';

export interface ISatisProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {
}

export const Satis = (props: ISatisProps) => {
  const [paginationState, setPaginationState] = useState(getSortState(props.location, ITEMS_PER_PAGE));
  const [search, setSearch] = useState('');

  const getAllEntities = () => {
    if (search && search !== '') {
      props.getSearchEntities(
        search,
        paginationState.activePage - 1,
        paginationState.itemsPerPage,
        `${paginationState.sort},${paginationState.order}`
      );
    } else {
      props.getEntities(paginationState.activePage - 1, paginationState.itemsPerPage, `${paginationState.sort},${paginationState.order}`);
    }
  };

  useEffect(() => {
    getAllEntities();
  }, []);

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

  const handleSearch = event => setSearch(event.target.value);

  const startSearching = () => {
    if (paginationState.activePage === 1 && (search || search === ''))
      getAllEntities();
    else if (search) {
      setPaginationState({
        ...paginationState,
        activePage: 1
      });
    }
  };

  const clear = () => {
    setSearch('');
    setPaginationState({
      ...paginationState,
      activePage: 1
    });
  };

  const handlePagination = currentPage =>
    setPaginationState({
      ...paginationState,
      activePage: currentPage,
    });

  const {satisList, match, totalItems} = props;
  return (
    <div>
      <h2 id="satis-heading">
        <Translate contentKey="koopApp.satis.home.title">Satis</Translate>
        <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
          <FontAwesomeIcon icon="plus"/>
          &nbsp;
          <Translate contentKey="koopApp.satis.home.createLabel">Create new Satis</Translate>
        </Link>
      </h2>
      <Row>
        <Col sm="12">
          <AvForm onSubmit={startSearching}>
            <AvGroup>
              <InputGroup>
                <AvInput
                  type="text"
                  name="search"
                  value={search}
                  onChange={handleSearch}
                  placeholder="Kullanıcıya Göre Satış Ara"
                />
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
        {satisList && satisList.length > 0 ? (
          <Table responsive>
            <thead>
            <tr>
              <th className="hand" onClick={sort('id')}>
                <Translate contentKey="global.field.id">ID</Translate> <FontAwesomeIcon icon="sort"/>
              </th>
              <th className="hand" onClick={sort('tarih')}>
                <Translate contentKey="koopApp.satis.tarih">Tarih</Translate> <FontAwesomeIcon icon="sort"/>
              </th>
              <th className="hand" onClick={sort('toplamTutar')}>
                <Translate contentKey="koopApp.satis.toplamTutar">Toplam Tutar</Translate> <FontAwesomeIcon
                icon="sort"/>
              </th>
              <th className="hand" onClick={sort('ortagaSatis')}>
                <Translate contentKey="koopApp.satis.ortagaSatis">Ortaga Satis</Translate> <FontAwesomeIcon
                icon="sort"/>
              </th>
              <th className="hand" onClick={sort('kartliSatis')}>
                <Translate contentKey="koopApp.satis.kartliSatis">Kartli Satis</Translate> <FontAwesomeIcon
                icon="sort"/>
              </th>
              <th>
                <Translate contentKey="koopApp.satis.user">User</Translate> <FontAwesomeIcon icon="sort"/>
              </th>
              <th/>
            </tr>
            </thead>
            <tbody>
            {satisList.map((satis, i) => (
              <tr key={`entity-${i}`}>
                <td>
                  <Button tag={Link} to={`${match.url}/${satis.id}`} color="link" size="sm">
                    {satis.id}
                  </Button>
                </td>
                <td>
                  <TextFormat type="date" value={satis.tarih} format={APP_DATE_FORMAT}/>
                </td>
                <td>{satis.toplamTutar}</td>
                <td><Checkbox checked={satis.ortagaSatis} disabled /></td>
                <td><Checkbox checked={satis.kartliSatis} disabled /></td>
                <td>{satis.user ? satis.user.login : ''}</td>
                <td className="text-right">
                  <div className="btn-group flex-btn-group-container">
                    <Button tag={Link} to={`${match.url}/${satis.id}`} color="info" size="sm">
                      <FontAwesomeIcon icon="eye"/>{' '}
                      <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                    </Button>
                    <Button
                      tag={Link}
                      to={`${match.url}/${satis.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                      color="primary"
                      size="sm"
                    >
                      <FontAwesomeIcon icon="pencil-alt"/>{' '}
                      <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
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
            <Translate contentKey="koopApp.satis.home.notFound">No Satis found</Translate>
          </div>
        )}
      </div>
      <div className={satisList && satisList.length > 0 ? '' : 'd-none'}>
        <Row className="justify-content-center">
          <JhiItemCount page={paginationState.activePage} total={totalItems} itemsPerPage={paginationState.itemsPerPage}
                        i18nEnabled/>
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

const mapStateToProps = ({satis}: IRootState) => ({
  satisList: satis.entities,
  totalItems: satis.totalItems
});

const mapDispatchToProps = {
  getEntities,
  getSearchEntities
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Satis);
