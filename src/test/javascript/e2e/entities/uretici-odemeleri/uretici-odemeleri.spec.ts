import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import UreticiOdemeleriComponentsPage from './uretici-odemeleri.page-object';
import UreticiOdemeleriUpdatePage from './uretici-odemeleri-update.page-object';
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

describe('UreticiOdemeleri e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let ureticiOdemeleriComponentsPage: UreticiOdemeleriComponentsPage;
  let ureticiOdemeleriUpdatePage: UreticiOdemeleriUpdatePage;

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
    ureticiOdemeleriComponentsPage = new UreticiOdemeleriComponentsPage();
    ureticiOdemeleriComponentsPage = await ureticiOdemeleriComponentsPage.goToPage(navBarPage);
  });

  it('should load UreticiOdemeleris', async () => {
    expect(await ureticiOdemeleriComponentsPage.title.getText()).to.match(/Uretici Odemeleris/);
    expect(await ureticiOdemeleriComponentsPage.createButton.isEnabled()).to.be.true;
  });

  it('should create and delete UreticiOdemeleris', async () => {
    const beforeRecordsCount = (await isVisible(ureticiOdemeleriComponentsPage.noRecords))
      ? 0
      : await getRecordsCount(ureticiOdemeleriComponentsPage.table);
    ureticiOdemeleriUpdatePage = await ureticiOdemeleriComponentsPage.goToCreateUreticiOdemeleri();
    await ureticiOdemeleriUpdatePage.enterData();

    expect(await ureticiOdemeleriComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilDisplayed(ureticiOdemeleriComponentsPage.table);
    await waitUntilCount(ureticiOdemeleriComponentsPage.records, beforeRecordsCount + 1);
    expect(await ureticiOdemeleriComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);

    await ureticiOdemeleriComponentsPage.deleteUreticiOdemeleri();
    if (beforeRecordsCount !== 0) {
      await waitUntilCount(ureticiOdemeleriComponentsPage.records, beforeRecordsCount);
      expect(await ureticiOdemeleriComponentsPage.records.count()).to.eq(beforeRecordsCount);
    } else {
      await waitUntilDisplayed(ureticiOdemeleriComponentsPage.noRecords);
    }
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
