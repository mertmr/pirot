import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import VirmanComponentsPage from './virman.page-object';
import VirmanUpdatePage from './virman-update.page-object';
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

describe('Virman e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let virmanComponentsPage: VirmanComponentsPage;
  let virmanUpdatePage: VirmanUpdatePage;
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
    virmanComponentsPage = new VirmanComponentsPage();
    virmanComponentsPage = await virmanComponentsPage.goToPage(navBarPage);
  });

  it('should load Virmen', async () => {
    expect(await virmanComponentsPage.title.getText()).to.match(/Virmen/);
    expect(await virmanComponentsPage.createButton.isEnabled()).to.be.true;
  });

  it('should create and delete Virmen', async () => {
    const beforeRecordsCount = (await isVisible(virmanComponentsPage.noRecords)) ? 0 : await getRecordsCount(virmanComponentsPage.table);
    virmanUpdatePage = await virmanComponentsPage.goToCreateVirman();
    await virmanUpdatePage.enterData();

    expect(await virmanComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilDisplayed(virmanComponentsPage.table);
    await waitUntilCount(virmanComponentsPage.records, beforeRecordsCount + 1);
    expect(await virmanComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);

    await virmanComponentsPage.deleteVirman();
    if (beforeRecordsCount !== 0) {
      await waitUntilCount(virmanComponentsPage.records, beforeRecordsCount);
      expect(await virmanComponentsPage.records.count()).to.eq(beforeRecordsCount);
    } else {
      await waitUntilDisplayed(virmanComponentsPage.noRecords);
    }
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
