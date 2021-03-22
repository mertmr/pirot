import './sidebar.scss';

import React, { useState } from 'react';
import { Translate, Storage } from 'react-jhipster';
import { Navbar, Nav, NavbarToggler, NavbarBrand, Collapse } from 'reactstrap';
import LoadingBar from 'react-redux-loading-bar';

import { Home, Brand } from './sidebar-components';
import { AdminMenu, EntitiesMenu, ReportsMenu, AccountMenu, LocaleMenu } from '../menus';
import MenuItem from 'app/shared/layout/menus/menu-item';

export interface ISidebarProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
  ribbonEnv: string;
  isInProduction: boolean;
  isSwaggerEnabled: boolean;
  menuOpen: boolean;
  currentLocale: string;
  onLocaleChange: Function;
  onClick: Function;
}

const Sidebar = (props: ISidebarProps) => {
  const handleLocaleChange = event => {
    const langKey = event.target.value;
    Storage.session.set('locale', langKey);
    props.onLocaleChange(langKey);
  };

  return (
    <div className="app-sidebar">
      <Collapse isOpen={props.menuOpen} navbar style={{ height: '100%' }}>
        <LoadingBar className="loading-bar" />
        <Navbar dark className="jh-navbar-sidebar">
          <Collapse isOpen={props.menuOpen} navbar>
            <Brand />
            <Nav id="sidebar-tabs" className="ml-auto preserve-space" navbar>
              <Home onClick={props.onClick} />
              {props.isAuthenticated && (
                <EntitiesMenu onClick={props.onClick} isAdmin={props.isAdmin} isAuthenticated={props.isAuthenticated} />
              )}
              {props.isAuthenticated && (
                <ReportsMenu onClick={props.onClick} isAdmin={props.isAdmin} isAuthenticated={props.isAuthenticated} />
              )}
              {props.isAuthenticated && props.isAdmin && (
                <AdminMenu showSwagger={props.isSwaggerEnabled} showDatabase={!props.isInProduction} />
              )}
              <LocaleMenu currentLocale={props.currentLocale} onClick={props.onClick} />
              <AccountMenu isAuthenticated={props.isAuthenticated} />
            </Nav>
          </Collapse>
        </Navbar>
      </Collapse>
    </div>
  );
};

export default Sidebar;
