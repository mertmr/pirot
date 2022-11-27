import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {Link, RouteComponentProps} from 'react-router-dom';
import {Row} from 'reactstrap';
import {JhiItemCount, JhiPagination, Translate} from 'react-jhipster';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import {IRootState} from 'app/shared/reducers';
import {getEntities, searchStokGirisiByUrun} from './stok-girisi.reducer';
import {ITEMS_PER_PAGE} from 'app/shared/util/pagination.constants';
import {getSortState} from 'app/shared/util/pagination-utils';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {AutoComplete} from "primereact/autocomplete";
import {convertDateToString} from "app/shared/util/date-utils";
import {InputText} from "primereact/inputtext";

export interface IStokGirisiProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {
}

export const StokGirisi = (props: IStokGirisiProps) => {
  const [search, setSearch] = useState('');
  const handleSearch = (value, filter) => setSearch(filter);
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

  useEffect(() => {
    startSearching();
  }, [search]);

  const clear = () => {
    setSearch('');
    setPaginationState({
      ...paginationState,
      activePage: 1,
    });
  };

  const urunFilterTemplate = (options) => {
    return <InputText value={search} onChange={(e) => setSearch(e.target.value)}/>
  }

  const dateBodyTemplate = (rowData) => {
    return convertDateToString(rowData.tarih);
  }

  const urunAdiTemplate = (rowData) => {
    return <Link to={`stok-girisi/${rowData.id}`}>{rowData.urunAdi}</Link>
  }

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
      <div className="table-responsive">
        {stokGirisiList && stokGirisiList.length > 0 ? (
          <div className="card">
            <DataTable value={stokGirisiList}
                       responsiveLayout="scroll"
                       filterDisplay="row"
                       rows={ITEMS_PER_PAGE}>
              <Column field="urunAdi" header="Ürün Adı" filter
                      filterField="urunAdi" showFilterMatchModes={false}
                      filterElement={urunFilterTemplate}
                      body={urunAdiTemplate}
                      filterPlaceholder="Ürün Adı Ara"
                      style={{minWidth: '12rem'}}></Column>
              <Column field="miktar" header="Miktar"></Column>
              <Column field="notlar" header="Notlar"></Column>
              <Column field="tarih" header="Tarih" body={dateBodyTemplate}></Column>
            </DataTable>
          </div>
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
  stokGirisiList: stokGirisi.entitiesDto,
  loading: stokGirisi.loading,
  totalItems: stokGirisi.totalItems,
});

const mapDispatchToProps = {
  getEntities,
  searchStokGirisiByUrun,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(StokGirisi);
