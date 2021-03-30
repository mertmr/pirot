import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import StokGirisiComponentsPage from './stok-girisi.page-object';
import StokGirisiUpdatePage from './stok-girisi-update.page-object';
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

describe('StokGirisi e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let stokGirisiComponentsPage: StokGirisiComponentsPage;
  let stokGirisiUpdatePage: StokGirisiUpdatePage;
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
    stokGirisiComponentsPage = new StokGirisiComponentsPage();
    stokGirisiComponentsPage = await stokGirisiComponentsPage.goToPage(navBarPage);
  });

  it('should load StokGirisis', async () => {
    expect(await stokGirisiComponentsPage.title.getText()).to.match(/Stok Girisis/);
    expect(await stokGirisiComponentsPage.createButton.isEnabled()).to.be.true;
  });

  it('should create and delete StokGirisis', async () => {
    const beforeRecordsCount = (await isVisible(stokGirisiComponentsPage.noRecords))
      ? 0
      : await getRecordsCount(stokGirisiComponentsPage.table);
    stokGirisiUpdatePage = await stokGirisiComponentsPage.goToCreateStokGirisi();
    await stokGirisiUpdatePage.enterData();

    expect(await stokGirisiComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilDisplayed(stokGirisiComponentsPage.table);
    await waitUntilCount(stokGirisiComponentsPage.records, beforeRecordsCount + 1);
    expect(await stokGirisiComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);

    await stokGirisiComponentsPage.deleteStokGirisi();
    if (beforeRecordsCount !== 0) {
      await waitUntilCount(stokGirisiComponentsPage.records, beforeRecordsCount);
      expect(await stokGirisiComponentsPage.records.count()).to.eq(beforeRecordsCount);
    } else {
      await waitUntilDisplayed(stokGirisiComponentsPage.noRecords);
    }
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
