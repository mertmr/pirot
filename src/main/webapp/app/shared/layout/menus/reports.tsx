import React from 'react';
import MenuItem from 'app/shared/layout/menus/menu-item';
import {Translate, translate} from 'react-jhipster';
import {NavDropdown} from './menu-components';

export const ReportsMenu = props => (
  <NavDropdown icon="th-list" name={translate('global.menu.reports.main')} id="report-menu">
    <MenuItem icon="asterisk" to="/reports/ciro">
      <Translate contentKey="global.menu.reports.ciro"/>
    </MenuItem>
  </NavDropdown>
);
