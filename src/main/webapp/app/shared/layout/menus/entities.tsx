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
    <MenuItem icon="money-check" to="/satis">
      <Translate contentKey="global.menu.entities.satis" />
    </MenuItem>
    <MenuItem icon="hand-holding-usd" to="/virman">
      <Translate contentKey="global.menu.entities.virman" />
    </MenuItem>
    <MenuItem icon="wallet" to="/gider">
      <Translate contentKey="global.menu.entities.gider" />
    </MenuItem>
    <MenuItem icon="keyboard" to="/stok-girisi">
      <Translate contentKey="global.menu.entities.stokGirisi" />
    </MenuItem>
    <MenuItem icon="chalkboard-teacher" to="/nobet-hareketleri">
      <Translate contentKey="global.menu.entities.nobetHareketleri" />
    </MenuItem>
    {props.isAuthenticated && props.isAdmin && (
      <MenuItem icon="funnel-dollar" to="/kdv-kategorisi">
        <Translate contentKey="global.menu.entities.kdvKategorisi" />
      </MenuItem>
    )}
    <MenuItem icon="warehouse" to="/satis-stok-hareketleri">
      <Translate contentKey="global.menu.entities.satisStokHareketleri" />
    </MenuItem>
    <MenuItem icon="box-open" to="/urun">
      <Translate contentKey="global.menu.entities.urun" />
    </MenuItem>
    <MenuItem icon="cash-register" to="/kasa-hareketleri">
      <Translate contentKey="global.menu.entities.kasaHareketleri" />
    </MenuItem>
    {props.isAuthenticated && props.isAdmin && (
      <MenuItem icon="user" to="/kisiler">
        <Translate contentKey="global.menu.entities.kisiler" />
      </MenuItem>
    )}
    {/* <MenuItem icon="asterisk" to="/urun-fiyat-hesap">
      <Translate contentKey="global.menu.entities.urunFiyatHesap" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/urun-fiyat">
      <Translate contentKey="global.menu.entities.urunFiyat" />
    </MenuItem>
    <MenuItem icon="envelope-open-text" to="/borc-alacak">
      <Translate contentKey="global.menu.entities.borcAlacak" />
    </MenuItem>
    <MenuItem icon="people-carry" to="/uretici">
      <Translate contentKey="global.menu.entities.uretici" />
    </MenuItem> */}
    {/* jhipster-needle-add-entity-to-menu - JHipster will add entities to the menu here */}
  </NavDropdown>
);
