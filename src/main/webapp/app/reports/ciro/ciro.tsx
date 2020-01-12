import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {RouteComponentProps} from 'react-router-dom';
import {Row, Table} from 'reactstrap';
import {getSortState, JhiItemCount, JhiPagination, TextFormat, Translate} from 'react-jhipster';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import {IRootState} from 'app/shared/reducers';
import {getEntities} from './ciro.reducer';
import {APP_DATE_FORMAT} from 'app/config/constants';
import {ITEMS_PER_PAGE} from 'app/shared/util/pagination.constants';

export interface ICiroProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {
}

export const Ciro = (props: ICiroProps) => {
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

  const {ciroList, match, totalItems} = props;
  return (
    <div>
      <h2 id="ciro-heading">
        <Translate contentKey="koopApp.ciro.home.title">Ciro</Translate>
      </h2>
      <div className="table-responsive">
        {ciroList && ciroList.length > 0 ? (
          <Table responsive>
            <thead>
            <tr>
              <th className="hand" onClick={sort('tarih')}>
                <Translate contentKey="koopApp.ciro.tarih">Tarih</Translate> <FontAwesomeIcon icon="sort"/>
              </th>
              <th className="hand" onClick={sort('tutar')}>
                <Translate contentKey="koopApp.ciro.tutar">Tutar</Translate> <FontAwesomeIcon icon="sort"/>
              </th>
            </tr>
            </thead>
            <tbody>
            {ciroList.map((ciro, i) => (
              <tr key={`entity-${i}`}>
                <td>
                  <TextFormat type="date" value={ciro.tarih} format={APP_DATE_FORMAT}/>
                </td>
                <td>{ciro.tutar}</td>
              </tr>
            ))}
            </tbody>
          </Table>
        ) : (
          <div className="alert alert-warning">
            <Translate contentKey="koopApp.ciro.home.notFound">No Ciro found</Translate>
          </div>
        )}
      </div>
      <div className={ciroList && ciroList.length > 0 ? '' : 'd-none'}>
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

const mapStateToProps = ({ciro}: IRootState) => ({
  ciroList: ciro.entities,
  totalItems: ciro.totalItems
});

const mapDispatchToProps = {
  getEntities
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Ciro);
