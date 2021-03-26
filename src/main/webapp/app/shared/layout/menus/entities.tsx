import React from 'react';
import MenuItem from 'app/shared/layout/menus/menu-item';
import { DropdownItem } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Translate, translate } from 'react-jhipster';
import { NavLink as Link } from 'react-router-dom';
import { NavDropdown } from './menu-components';

export const EntitiesMenu = props => (
  <NavDropdown
    icon="th-list"
    name={translate('global.menu.entities.main')}
    id="entity-menu"
    style={{ maxHeight: '80vh', overflow: 'auto' }}
  >
    <MenuItem icon="asterisk" to="/gider">
      <Translate contentKey="global.menu.entities.gider" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/kdv-kategorisi">
      <Translate contentKey="global.menu.entities.kdvKategorisi" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/satis">
      <Translate contentKey="global.menu.entities.satis" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/satis-stok-hareketleri">
      <Translate contentKey="global.menu.entities.satisStokHareketleri" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/stok-girisi">
      <Translate contentKey="global.menu.entities.stokGirisi" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/uretici">
      <Translate contentKey="global.menu.entities.uretici" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/urun">
      <Translate contentKey="global.menu.entities.urun" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/urun-fiyat">
      <Translate contentKey="global.menu.entities.urunFiyat" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/virman">
      <Translate contentKey="global.menu.entities.virman" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/borc-alacak">
      <Translate contentKey="global.menu.entities.borcAlacak" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/kasa-hareketleri">
      <Translate contentKey="global.menu.entities.kasaHareketleri" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/nobet-hareketleri">
      <Translate contentKey="global.menu.entities.nobetHareketleri" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/kisiler">
      <Translate contentKey="global.menu.entities.kisiler" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/urun-fiyat-hesap">
      <Translate contentKey="global.menu.entities.urunFiyatHesap" />
    </MenuItem>
    {/* jhipster-needle-add-entity-to-menu - JHipster will add entities to the menu here */}
  </NavDropdown>
);
