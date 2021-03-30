import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import UrunFiyatHesapComponentsPage from './urun-fiyat-hesap.page-object';
import UrunFiyatHesapUpdatePage from './urun-fiyat-hesap-update.page-object';
import {
  waitUntilDisplayed,
  waitUntilAnyDisplayed,
  click,
  getRecordsCount,
  waitUntilHidden,
  waitUntilCount,
  isVisible,
} from '../../util/utils';

const expect = chai.expect;

describe('UrunFiyatHesap e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let urunFiyatHesapComponentsPage: UrunFiyatHesapComponentsPage;
  let urunFiyatHesapUpdatePage: UrunFiyatHesapUpdatePage;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.waitUntilDisplayed();
    await signInPage.username.sendKeys(username);
    await signInPage.password.sendKeys(password);
    await signInPage.loginButton.click();
    await signInPage.waitUntilHidden();
    await waitUntilDisplayed(navBarPage.entityMenu);
    await waitUntilDisplayed(navBarPage.adminMenu);
    await waitUntilDisplayed(navBarPage.accountMenu);
  });

  beforeEach(async () => {
    await browser.get('/');
    await waitUntilDisplayed(navBarPage.entityMenu);
    urunFiyatHesapComponentsPage = new UrunFiyatHesapComponentsPage();
    urunFiyatHesapComponentsPage = await urunFiyatHesapComponentsPage.goToPage(navBarPage);
  });

  it('should load UrunFiyatHesaps', async () => {
    expect(await urunFiyatHesapComponentsPage.title.getText()).to.match(/Urun Fiyat Hesaps/);
    expect(await urunFiyatHesapComponentsPage.createButton.isEnabled()).to.be.true;
  });

  it('should create and delete UrunFiyatHesaps', async () => {
    const beforeRecordsCount = (await isVisible(urunFiyatHesapComponentsPage.noRecords))
      ? 0
      : await getRecordsCount(urunFiyatHesapComponentsPage.table);
    urunFiyatHesapUpdatePage = await urunFiyatHesapComponentsPage.goToCreateUrunFiyatHesap();
    await urunFiyatHesapUpdatePage.enterData();

    expect(await urunFiyatHesapComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilDisplayed(urunFiyatHesapComponentsPage.table);
    await waitUntilCount(urunFiyatHesapComponentsPage.records, beforeRecordsCount + 1);
    expect(await urunFiyatHesapComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);

    await urunFiyatHesapComponentsPage.deleteUrunFiyatHesap();
    if (beforeRecordsCount !== 0) {
      await waitUntilCount(urunFiyatHesapComponentsPage.records, beforeRecordsCount);
      expect(await urunFiyatHesapComponentsPage.records.count()).to.eq(beforeRecordsCount);
    } else {
      await waitUntilDisplayed(urunFiyatHesapComponentsPage.noRecords);
    }
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
