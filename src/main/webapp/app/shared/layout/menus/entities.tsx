import React from 'react';
import MenuItem from 'app/shared/layout/menus/menu-item';
import { Translate, translate } from 'react-jhipster';
import { NavDropdown } from './menu-components';

export interface IEntitiesMenuProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
  onClick: Function;
}

export const EntitiesMenu = (props: IEntitiesMenuProps) => (
  <NavDropdown
    icon="th-list"
    name={translate('global.menu.entities.main')}
    id="entity-menu"
    style={{ maxHeight: '90vh', overflow: 'auto' }}
  >
    <MenuItem icon="money-check" to="/satis" onClick={props.onClick}>
      <Translate contentKey="global.menu.entities.satis" />
    </MenuItem>
    <MenuItem icon="hand-holding-usd" to="/virman" onClick={props.onClick}>
      <Translate contentKey="global.menu.entities.virman" />
    </MenuItem>
    <MenuItem icon="wallet" to="/gider" onClick={props.onClick}>
      <Translate contentKey="global.menu.entities.gider" />
    </MenuItem>
    <MenuItem icon="keyboard" to="/stok-girisi" onClick={props.onClick}>
      <Translate contentKey="global.menu.entities.stokGirisi" />
    </MenuItem>
    <MenuItem icon="chalkboard-teacher" to="/nobet-hareketleri" onClick={props.onClick}>
      <Translate contentKey="global.menu.entities.nobetHareketleri" />
    </MenuItem>
    {props.isAuthenticated && props.isAdmin && (
      <MenuItem icon="funnel-dollar" to="/kdv-kategorisi" onClick={props.onClick}>
        <Translate contentKey="global.menu.entities.kdvKategorisi" />
      </MenuItem>
    )}
    <MenuItem icon="warehouse" to="/satis-stok-hareketleri" onClick={props.onClick}>
      <Translate contentKey="global.menu.entities.satisStokHareketleri" />
    </MenuItem>
    <MenuItem icon="box-open" to="/urun" onClick={props.onClick}>
      <Translate contentKey="global.menu.entities.urun" />
    </MenuItem><MenuItem icon="people-carry" to="/uretici" onClick={props.onClick}>
    <Translate contentKey="global.menu.entities.uretici" />
  </MenuItem>
    <MenuItem icon="cash-register" to="/kasa-hareketleri" onClick={props.onClick}>
      <Translate contentKey="global.menu.entities.kasaHareketleri" />
    </MenuItem>
    {props.isAuthenticated && props.isAdmin && (
      <MenuItem icon="user" to="/kisiler" onClick={props.onClick}>
        <Translate contentKey="global.menu.entities.kisiler" />
      </MenuItem>
    )}
    <MenuItem icon="asterisk" to="/urun-fiyat-hesap" onClick={props.onClick}>
      <Translate contentKey="global.menu.entities.urunFiyatHesap" />
    </MenuItem>
    <MenuItem icon="envelope-open-text" to="/borc-alacak" onClick={props.onClick}>
      <Translate contentKey="global.menu.entities.borcAlacak" />
    </MenuItem>
    {/* jhipster-needle-add-entity-to-menu - JHipster will add entities to the menu here */}
  </NavDropdown>
);
