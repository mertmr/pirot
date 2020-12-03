import React from 'react';
import MenuItem from 'app/shared/layout/menus/menu-item';
import { Translate, translate } from 'react-jhipster';
import { NavDropdown } from './menu-components';

export interface IReportsProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
  onClick: Function;
}

export const ReportsMenu = (props: IReportsProps) => (
  <NavDropdown icon="th-list" name={translate('global.menu.reports.main')} id="report-menu">
    <MenuItem icon="asterisk" to="/reports/ciro" onClick={props.onClick}>
      <Translate contentKey="global.menu.reports.ciro" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/reports/aylikSatislar" onClick={props.onClick}>
      Aylık Satışlar
    </MenuItem>
    {props.isAuthenticated && props.isAdmin && (
      <MenuItem icon="asterisk" to="/reports/ortakFaturalar" onClick={props.onClick}>
        Ortaklara Kesilen Faturalar
      </MenuItem>
    )}
    <MenuItem icon="asterisk" to="/reports/tukenme" onClick={props.onClick}>
      Ürün Tükenme Hızı
    </MenuItem>
  </NavDropdown>
);
