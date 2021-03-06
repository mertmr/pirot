import { getUrlParameter } from './url-utils';

export interface IPaginationBaseState {
  itemsPerPage: number;
  sort: string;
  order: string;
  activePage: number;
}

export const getSortState = (location, itemsPerPage): IPaginationBaseState => {
  const pageParam = getUrlParameter('page', location.search);
  const sortParam = getUrlParameter('sort', location.search);
  let sort = 'tarih';
  let order = 'desc';
  let activePage = 1;
  if (pageParam !== '' && !isNaN(parseInt(pageParam, 10))) {
    activePage = parseInt(pageParam, 10);
  }
  if (sortParam !== '') {
    sort = sortParam.split(',')[0];
    order = sortParam.split(',')[1];
  }
  return { itemsPerPage, sort, order, activePage };
};

export const getSortStateByIdDesc = (location, itemsPerPage): IPaginationBaseState => {
  const pageParam = getUrlParameter('page', location.search);
  const sortParam = getUrlParameter('sort', location.search);
  let sort = 'id';
  let order = 'desc';
  let activePage = 1;
  if (pageParam !== '' && !isNaN(parseInt(pageParam, 10))) {
    activePage = parseInt(pageParam, 10);
  }
  if (sortParam !== '') {
    sort = sortParam.split(',')[0];
    order = sortParam.split(',')[1];
  }
  return { itemsPerPage, sort, order, activePage };
};
