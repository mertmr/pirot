import { combineReducers } from 'redux';
import { loadingBarReducer as loadingBar } from 'react-redux-loading-bar';

import locale, { LocaleState } from './locale';
import authentication, { AuthenticationState } from './authentication';
import applicationProfile, { ApplicationProfileState } from './application-profile';

import administration, { AdministrationState } from 'app/modules/administration/administration.reducer';
import userManagement, { UserManagementState } from 'app/modules/administration/user-management/user-management.reducer';
import register, { RegisterState } from 'app/modules/account/register/register.reducer';
import activate, { ActivateState } from 'app/modules/account/activate/activate.reducer';
import password, { PasswordState } from 'app/modules/account/password/password.reducer';
import settings, { SettingsState } from 'app/modules/account/settings/settings.reducer';
import passwordReset, { PasswordResetState } from 'app/modules/account/password-reset/password-reset.reducer';
// prettier-ignore
import gider, {
  GiderState
} from 'app/entities/gider/gider.reducer';
// prettier-ignore
import kdvKategorisi, {
  KdvKategorisiState
} from 'app/entities/kdv-kategorisi/kdv-kategorisi.reducer';
// prettier-ignore
import satis, {
  SatisState
} from 'app/entities/satis/satis.reducer';
// prettier-ignore
import satisStokHareketleri, {
  SatisStokHareketleriState
} from 'app/entities/satis-stok-hareketleri/satis-stok-hareketleri.reducer';
// prettier-ignore
import stokGirisi, {
  StokGirisiState
} from 'app/entities/stok-girisi/stok-girisi.reducer';
// prettier-ignore
import uretici, {
  UreticiState
} from 'app/entities/uretici/uretici.reducer';
// prettier-ignore
import urun, {
  UrunState
} from 'app/entities/urun/urun.reducer';
// prettier-ignore
import urunFiyat, {
  UrunFiyatState
} from 'app/entities/urun-fiyat/urun-fiyat.reducer';
// prettier-ignore
import virman, {
  VirmanState
} from 'app/entities/virman/virman.reducer';
/* jhipster-needle-add-reducer-import - JHipster will add reducer here */

export interface IRootState {
  readonly authentication: AuthenticationState;
  readonly locale: LocaleState;
  readonly applicationProfile: ApplicationProfileState;
  readonly administration: AdministrationState;
  readonly userManagement: UserManagementState;
  readonly register: RegisterState;
  readonly activate: ActivateState;
  readonly passwordReset: PasswordResetState;
  readonly password: PasswordState;
  readonly settings: SettingsState;
  readonly gider: GiderState;
  readonly kdvKategorisi: KdvKategorisiState;
  readonly satis: SatisState;
  readonly satisStokHareketleri: SatisStokHareketleriState;
  readonly stokGirisi: StokGirisiState;
  readonly uretici: UreticiState;
  readonly urun: UrunState;
  readonly urunFiyat: UrunFiyatState;
  readonly virman: VirmanState;
  /* jhipster-needle-add-reducer-type - JHipster will add reducer type here */
  readonly loadingBar: any;
}

const rootReducer = combineReducers<IRootState>({
  authentication,
  locale,
  applicationProfile,
  administration,
  userManagement,
  register,
  activate,
  passwordReset,
  password,
  settings,
  gider,
  kdvKategorisi,
  satis,
  satisStokHareketleri,
  stokGirisi,
  uretici,
  urun,
  urunFiyat,
  virman,
  /* jhipster-needle-add-reducer-combine - JHipster will add reducer here */
  loadingBar
});

export default rootReducer;
