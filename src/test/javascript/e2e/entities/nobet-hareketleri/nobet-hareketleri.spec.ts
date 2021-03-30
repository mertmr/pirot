import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import NobetHareketleriComponentsPage from './nobet-hareketleri.page-object';
import NobetHareketleriUpdatePage from './nobet-hareketleri-update.page-object';
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

describe('NobetHareketleri e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let nobetHareketleriComponentsPage: NobetHareketleriComponentsPage;
  let nobetHareketleriUpdatePage: NobetHareketleriUpdatePage;
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
    nobetHareketleriComponentsPage = new NobetHareketleriComponentsPage();
    nobetHareketleriComponentsPage = await nobetHareketleriComponentsPage.goToPage(navBarPage);
  });

  it('should load NobetHareketleris', async () => {
    expect(await nobetHareketleriComponentsPage.title.getText()).to.match(/Nobet Hareketleris/);
    expect(await nobetHareketleriComponentsPage.createButton.isEnabled()).to.be.true;
  });

  it('should create and delete NobetHareketleris', async () => {
    const beforeRecordsCount = (await isVisible(nobetHareketleriComponentsPage.noRecords))
      ? 0
      : await getRecordsCount(nobetHareketleriComponentsPage.table);
    nobetHareketleriUpdatePage = await nobetHareketleriComponentsPage.goToCreateNobetHareketleri();
    await nobetHareketleriUpdatePage.enterData();

    expect(await nobetHareketleriComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilDisplayed(nobetHareketleriComponentsPage.table);
    await waitUntilCount(nobetHareketleriComponentsPage.records, beforeRecordsCount + 1);
    expect(await nobetHareketleriComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);

    await nobetHareketleriComponentsPage.deleteNobetHareketleri();
    if (beforeRecordsCount !== 0) {
      await waitUntilCount(nobetHareketleriComponentsPage.records, beforeRecordsCount);
      expect(await nobetHareketleriComponentsPage.records.count()).to.eq(beforeRecordsCount);
    } else {
      await waitUntilDisplayed(nobetHareketleriComponentsPage.noRecords);
    }
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
