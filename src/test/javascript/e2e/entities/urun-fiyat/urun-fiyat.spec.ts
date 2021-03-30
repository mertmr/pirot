import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import UrunFiyatComponentsPage from './urun-fiyat.page-object';
import UrunFiyatUpdatePage from './urun-fiyat-update.page-object';
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

describe('UrunFiyat e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let urunFiyatComponentsPage: UrunFiyatComponentsPage;
  let urunFiyatUpdatePage: UrunFiyatUpdatePage;
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
    urunFiyatComponentsPage = new UrunFiyatComponentsPage();
    urunFiyatComponentsPage = await urunFiyatComponentsPage.goToPage(navBarPage);
  });

  it('should load UrunFiyats', async () => {
    expect(await urunFiyatComponentsPage.title.getText()).to.match(/Urun Fiyats/);
    expect(await urunFiyatComponentsPage.createButton.isEnabled()).to.be.true;
  });

  it('should create and delete UrunFiyats', async () => {
    const beforeRecordsCount = (await isVisible(urunFiyatComponentsPage.noRecords))
      ? 0
      : await getRecordsCount(urunFiyatComponentsPage.table);
    urunFiyatUpdatePage = await urunFiyatComponentsPage.goToCreateUrunFiyat();
    await urunFiyatUpdatePage.enterData();

    expect(await urunFiyatComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilDisplayed(urunFiyatComponentsPage.table);
    await waitUntilCount(urunFiyatComponentsPage.records, beforeRecordsCount + 1);
    expect(await urunFiyatComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);

    await urunFiyatComponentsPage.deleteUrunFiyat();
    if (beforeRecordsCount !== 0) {
      await waitUntilCount(urunFiyatComponentsPage.records, beforeRecordsCount);
      expect(await urunFiyatComponentsPage.records.count()).to.eq(beforeRecordsCount);
    } else {
      await waitUntilDisplayed(urunFiyatComponentsPage.noRecords);
    }
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
