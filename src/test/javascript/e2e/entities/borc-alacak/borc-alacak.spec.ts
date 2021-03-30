import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import BorcAlacakComponentsPage from './borc-alacak.page-object';
import BorcAlacakUpdatePage from './borc-alacak-update.page-object';
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

describe('BorcAlacak e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let borcAlacakComponentsPage: BorcAlacakComponentsPage;
  let borcAlacakUpdatePage: BorcAlacakUpdatePage;
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
    borcAlacakComponentsPage = new BorcAlacakComponentsPage();
    borcAlacakComponentsPage = await borcAlacakComponentsPage.goToPage(navBarPage);
  });

  it('should load BorcAlacaks', async () => {
    expect(await borcAlacakComponentsPage.title.getText()).to.match(/Borc Alacaks/);
    expect(await borcAlacakComponentsPage.createButton.isEnabled()).to.be.true;
  });

  it('should create and delete BorcAlacaks', async () => {
    const beforeRecordsCount = (await isVisible(borcAlacakComponentsPage.noRecords))
      ? 0
      : await getRecordsCount(borcAlacakComponentsPage.table);
    borcAlacakUpdatePage = await borcAlacakComponentsPage.goToCreateBorcAlacak();
    await borcAlacakUpdatePage.enterData();

    expect(await borcAlacakComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilDisplayed(borcAlacakComponentsPage.table);
    await waitUntilCount(borcAlacakComponentsPage.records, beforeRecordsCount + 1);
    expect(await borcAlacakComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);

    await borcAlacakComponentsPage.deleteBorcAlacak();
    if (beforeRecordsCount !== 0) {
      await waitUntilCount(borcAlacakComponentsPage.records, beforeRecordsCount);
      expect(await borcAlacakComponentsPage.records.count()).to.eq(beforeRecordsCount);
    } else {
      await waitUntilDisplayed(borcAlacakComponentsPage.noRecords);
    }
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
