import "./sidebar.scss";

import React, { useEffect } from "react";
import { Storage } from "react-jhipster";
import { Collapse, Nav, Navbar } from "reactstrap";
import LoadingBar from "react-redux-loading-bar";

import { Brand, Home } from "./sidebar-components";
import { AccountMenu, AdminMenu, EntitiesMenu, LocaleMenu, ReportsMenu } from "../menus";
import { connect } from "react-redux";
import { getDashboardReports } from "app/shared/reducers/dashboard-reports.reducer";

export interface ISidebarProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
  ribbonEnv: string;
  isInProduction: boolean;
  isSwaggerEnabled: boolean;
  menuOpen: boolean;
  currentLocale: string;
  getDashboardReports: Function;
  onLocaleChange: Function;
  onClick: Function;
  dashboardReports: any;
  account: any;
}

const Sidebar = (props: ISidebarProps) => {
  const { account, dashboardReports, isAuthenticated } = props;

  const handleLocaleChange = event => {
    const langKey = event.target.value;
    Storage.session.set("locale", langKey);
    props.onLocaleChange(langKey);
  };

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     props.getDashboardReports();
  //   }
  // }, [props.createEntity]);

  return (
    <div className="app-sidebar col-md-none">
      <Collapse isOpen={props.menuOpen} navbar style={{ height: "100%" }}>
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
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Kasa</h5>
                <p className="card-text"> {dashboardReports.kasadaNeVar ? dashboardReports.kasadaNeVar : 0} TL</p>
              </div>
            </div>
          </Collapse>
        </Navbar>
      </Collapse>
    </div>
  );
};

const mapStateToProps = storeState => ({
  dashboardReports: storeState.dashboardReportsState.entity,
  account: storeState.authentication.account
});

const mapDispatchToProps = {
  getDashboardReports
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
