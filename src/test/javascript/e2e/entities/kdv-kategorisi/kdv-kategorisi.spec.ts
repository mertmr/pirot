import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import KdvKategorisiComponentsPage from './kdv-kategorisi.page-object';
import KdvKategorisiUpdatePage from './kdv-kategorisi-update.page-object';
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

describe('KdvKategorisi e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let kdvKategorisiComponentsPage: KdvKategorisiComponentsPage;
  let kdvKategorisiUpdatePage: KdvKategorisiUpdatePage;
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
    kdvKategorisiComponentsPage = new KdvKategorisiComponentsPage();
    kdvKategorisiComponentsPage = await kdvKategorisiComponentsPage.goToPage(navBarPage);
  });

  it('should load KdvKategorisis', async () => {
    expect(await kdvKategorisiComponentsPage.title.getText()).to.match(/Kdv Kategorisis/);
    expect(await kdvKategorisiComponentsPage.createButton.isEnabled()).to.be.true;
  });

  it('should create and delete KdvKategorisis', async () => {
    const beforeRecordsCount = (await isVisible(kdvKategorisiComponentsPage.noRecords))
      ? 0
      : await getRecordsCount(kdvKategorisiComponentsPage.table);
    kdvKategorisiUpdatePage = await kdvKategorisiComponentsPage.goToCreateKdvKategorisi();
    await kdvKategorisiUpdatePage.enterData();

    expect(await kdvKategorisiComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilDisplayed(kdvKategorisiComponentsPage.table);
    await waitUntilCount(kdvKategorisiComponentsPage.records, beforeRecordsCount + 1);
    expect(await kdvKategorisiComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);

    await kdvKategorisiComponentsPage.deleteKdvKategorisi();
    if (beforeRecordsCount !== 0) {
      await waitUntilCount(kdvKategorisiComponentsPage.records, beforeRecordsCount);
      expect(await kdvKategorisiComponentsPage.records.count()).to.eq(beforeRecordsCount);
    } else {
      await waitUntilDisplayed(kdvKategorisiComponentsPage.noRecords);
    }
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
