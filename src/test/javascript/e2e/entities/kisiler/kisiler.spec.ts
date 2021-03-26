import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import KisilerComponentsPage from './kisiler.page-object';
import KisilerUpdatePage from './kisiler-update.page-object';
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

describe('Kisiler e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let kisilerComponentsPage: KisilerComponentsPage;
  let kisilerUpdatePage: KisilerUpdatePage;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.waitUntilDisplayed();

    await signInPage.username.sendKeys('admin');
    await signInPage.password.sendKeys('admin');
    await signInPage.loginButton.click();
    await signInPage.waitUntilHidden();
    await waitUntilDisplayed(navBarPage.entityMenu);
    await waitUntilDisplayed(navBarPage.adminMenu);
    await waitUntilDisplayed(navBarPage.accountMenu);
  });

  beforeEach(async () => {
    await browser.get('/');
    await waitUntilDisplayed(navBarPage.entityMenu);
    kisilerComponentsPage = new KisilerComponentsPage();
    kisilerComponentsPage = await kisilerComponentsPage.goToPage(navBarPage);
  });

  it('should load Kisilers', async () => {
    expect(await kisilerComponentsPage.title.getText()).to.match(/Kisilers/);
    expect(await kisilerComponentsPage.createButton.isEnabled()).to.be.true;
  });

  it('should create and delete Kisilers', async () => {
    const beforeRecordsCount = (await isVisible(kisilerComponentsPage.noRecords)) ? 0 : await getRecordsCount(kisilerComponentsPage.table);
    kisilerUpdatePage = await kisilerComponentsPage.goToCreateKisiler();
    await kisilerUpdatePage.enterData();

    expect(await kisilerComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilDisplayed(kisilerComponentsPage.table);
    await waitUntilCount(kisilerComponentsPage.records, beforeRecordsCount + 1);
    expect(await kisilerComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);

    await kisilerComponentsPage.deleteKisiler();
    if (beforeRecordsCount !== 0) {
      await waitUntilCount(kisilerComponentsPage.records, beforeRecordsCount);
      expect(await kisilerComponentsPage.records.count()).to.eq(beforeRecordsCount);
    } else {
      await waitUntilDisplayed(kisilerComponentsPage.noRecords);
    }
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
