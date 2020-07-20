import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import GiderComponentsPage from './gider.page-object';
import GiderUpdatePage from './gider-update.page-object';
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

describe('Gider e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let giderComponentsPage: GiderComponentsPage;
  let giderUpdatePage: GiderUpdatePage;

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
    giderComponentsPage = new GiderComponentsPage();
    giderComponentsPage = await giderComponentsPage.goToPage(navBarPage);
  });

  it('should load Giders', async () => {
    expect(await giderComponentsPage.title.getText()).to.match(/Giders/);
    expect(await giderComponentsPage.createButton.isEnabled()).to.be.true;
  });

  it('should create and delete Giders', async () => {
    const beforeRecordsCount = (await isVisible(giderComponentsPage.noRecords)) ? 0 : await getRecordsCount(giderComponentsPage.table);
    giderUpdatePage = await giderComponentsPage.goToCreateGider();
    await giderUpdatePage.enterData();

    expect(await giderComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilDisplayed(giderComponentsPage.table);
    await waitUntilCount(giderComponentsPage.records, beforeRecordsCount + 1);
    expect(await giderComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);

    await giderComponentsPage.deleteGider();
    if (beforeRecordsCount !== 0) {
      await waitUntilCount(giderComponentsPage.records, beforeRecordsCount);
      expect(await giderComponentsPage.records.count()).to.eq(beforeRecordsCount);
    } else {
      await waitUntilDisplayed(giderComponentsPage.noRecords);
    }
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
