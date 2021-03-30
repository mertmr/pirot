import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import UrunComponentsPage from './urun.page-object';
import UrunUpdatePage from './urun-update.page-object';
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

describe('Urun e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let urunComponentsPage: UrunComponentsPage;
  let urunUpdatePage: UrunUpdatePage;
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
    urunComponentsPage = new UrunComponentsPage();
    urunComponentsPage = await urunComponentsPage.goToPage(navBarPage);
  });

  it('should load Uruns', async () => {
    expect(await urunComponentsPage.title.getText()).to.match(/Uruns/);
    expect(await urunComponentsPage.createButton.isEnabled()).to.be.true;
  });

  it('should create and delete Uruns', async () => {
    const beforeRecordsCount = (await isVisible(urunComponentsPage.noRecords)) ? 0 : await getRecordsCount(urunComponentsPage.table);
    urunUpdatePage = await urunComponentsPage.goToCreateUrun();
    await urunUpdatePage.enterData();

    expect(await urunComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilDisplayed(urunComponentsPage.table);
    await waitUntilCount(urunComponentsPage.records, beforeRecordsCount + 1);
    expect(await urunComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);

    await urunComponentsPage.deleteUrun();
    if (beforeRecordsCount !== 0) {
      await waitUntilCount(urunComponentsPage.records, beforeRecordsCount);
      expect(await urunComponentsPage.records.count()).to.eq(beforeRecordsCount);
    } else {
      await waitUntilDisplayed(urunComponentsPage.noRecords);
    }
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
