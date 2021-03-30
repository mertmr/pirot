import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import UreticiComponentsPage from './uretici.page-object';
import UreticiUpdatePage from './uretici-update.page-object';
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

describe('Uretici e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let ureticiComponentsPage: UreticiComponentsPage;
  let ureticiUpdatePage: UreticiUpdatePage;
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
    ureticiComponentsPage = new UreticiComponentsPage();
    ureticiComponentsPage = await ureticiComponentsPage.goToPage(navBarPage);
  });

  it('should load Ureticis', async () => {
    expect(await ureticiComponentsPage.title.getText()).to.match(/Ureticis/);
    expect(await ureticiComponentsPage.createButton.isEnabled()).to.be.true;
  });

  it('should create and delete Ureticis', async () => {
    const beforeRecordsCount = (await isVisible(ureticiComponentsPage.noRecords)) ? 0 : await getRecordsCount(ureticiComponentsPage.table);
    ureticiUpdatePage = await ureticiComponentsPage.goToCreateUretici();
    await ureticiUpdatePage.enterData();

    expect(await ureticiComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilDisplayed(ureticiComponentsPage.table);
    await waitUntilCount(ureticiComponentsPage.records, beforeRecordsCount + 1);
    expect(await ureticiComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);

    await ureticiComponentsPage.deleteUretici();
    if (beforeRecordsCount !== 0) {
      await waitUntilCount(ureticiComponentsPage.records, beforeRecordsCount);
      expect(await ureticiComponentsPage.records.count()).to.eq(beforeRecordsCount);
    } else {
      await waitUntilDisplayed(ureticiComponentsPage.noRecords);
    }
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
