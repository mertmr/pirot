import React from 'react';
import { Translate } from 'react-jhipster';

import { NavbarBrand, NavItem, NavLink } from 'reactstrap';
import { NavLink as Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import appConfig from 'app/config/constants';

export const BrandIcon = props => (
  <div {...props} className="brand-icon">
    <img src="content/images/koop.jpg" alt="Logo" />
  </div>
);

export const Brand = props => (
  <NavbarBrand tag={Link} to="/" className="brand-logo">
    <BrandIcon style={{ marginRight: '20px' }} />
    <span className="d-none d-md-inline">
      <span className="brand-title">
        <Translate contentKey="global.title">Koop</Translate>
      </span>
    </span>

    <span className="d-none d-md-inline">
      <span className="navbar-version">{appConfig.VERSION}</span>
    </span>
  </NavbarBrand>
);

export const Home = ({ onClick }) => (
  <NavItem>
    <NavLink tag={Link} to="/" className="d-flex align-items-center" onClick={onClick}>
      <FontAwesomeIcon icon="home" />
      <span>
        <Translate contentKey="global.menu.home">Home</Translate>
      </span>
    </NavLink>
  </NavItem>
);
