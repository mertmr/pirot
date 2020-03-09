import React from 'react';
import MenuItem from 'app/shared/layout/menus/menu-item';
import {Translate, translate} from 'react-jhipster';
import {NavDropdown} from './menu-components';

export const ReportsMenu = ({onClick}) => (
    <NavDropdown icon="th-list" name={translate('global.menu.reports.main')} id="report-menu">
        <MenuItem icon="asterisk" to="/reports/ciro" onClick={onClick}>
            <Translate contentKey="global.menu.reports.ciro"/>
        </MenuItem>
        <MenuItem icon="asterisk" to="/reports/aylikSatislar" onClick={onClick}>
            Aylık Satışlar
        </MenuItem>
      <MenuItem icon="asterisk" to="/reports/ortakFaturalar" onClick={onClick}>
        Ortaklara Kesilen Faturalar
      </MenuItem>
    </NavDropdown>
);
