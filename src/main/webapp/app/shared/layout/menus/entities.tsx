import React from 'react';
import MenuItem from 'app/shared/layout/menus/menu-item';
import {Translate, translate} from 'react-jhipster';
import {NavDropdown} from './menu-components';

export const EntitiesMenu = ({onClick}) => (
  <NavDropdown
    icon="th-list"
    name={translate('global.menu.entities.main')}
    id="entity-menu"
    style={{maxHeight: '80vh', overflow: 'auto'}}
  >
    <MenuItem icon="money-check" to="/satis" onClick={onClick}>
      <Translate contentKey="global.menu.entities.satis"/>
    </MenuItem>
    <MenuItem icon="hand-holding-usd" to="/virman" onClick={onClick}>
      <Translate contentKey="global.menu.entities.virman"/>
    </MenuItem>
    <MenuItem icon="wallet" to="/gider" onClick={onClick}>
      <Translate contentKey="global.menu.entities.gider"/>
    </MenuItem>
    <MenuItem icon="keyboard" to="/stok-girisi" onClick={onClick}>
      <Translate contentKey="global.menu.entities.stokGirisi"/>
    </MenuItem>
    <MenuItem icon="chalkboard-teacher" to="/nobet-hareketleri" onClick={onClick}>
      <Translate contentKey="global.menu.entities.nobetHareketleri"/>
    </MenuItem>
    <MenuItem icon="funnel-dollar" to="/kdv-kategorisi" onClick={onClick}>
      <Translate contentKey="global.menu.entities.kdvKategorisi"/>
    </MenuItem>
    <MenuItem icon="warehouse" to="/satis-stok-hareketleri" onClick={onClick}>
      <Translate contentKey="global.menu.entities.satisStokHareketleri"/>
    </MenuItem>
    <MenuItem icon="people-carry" to="/uretici" onClick={onClick}>
      <Translate contentKey="global.menu.entities.uretici"/>
    </MenuItem>
    <MenuItem icon="box-open" to="/urun" onClick={onClick}>
      <Translate contentKey="global.menu.entities.urun"/>
    </MenuItem>
    <MenuItem icon="asterisk" to="/urun-fiyat" onClick={onClick}>
      <Translate contentKey="global.menu.entities.urunFiyat"/>
    </MenuItem>
    <MenuItem icon="envelope-open-text" to="/borc-alacak" onClick={onClick}>
      <Translate contentKey="global.menu.entities.borcAlacak"/>
    </MenuItem>
    <MenuItem icon="cash-register" to="/kasa-hareketleri" onClick={onClick}>
      <Translate contentKey="global.menu.entities.kasaHareketleri"/>
    </MenuItem>
    <MenuItem icon="user" to="/kisiler" onClick={onClick}>
      <Translate contentKey="global.menu.entities.kisiler"/>
    </MenuItem>
    {/* jhipster-needle-add-entity-to-menu - JHipster will add entities to the menu here */}
  </NavDropdown>
);
