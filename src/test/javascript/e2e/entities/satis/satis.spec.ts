import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import SatisComponentsPage from './satis.page-object';
import SatisUpdatePage from './satis-update.page-object';
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

describe('Satis e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let satisComponentsPage: SatisComponentsPage;
  let satisUpdatePage: SatisUpdatePage;

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
    satisComponentsPage = new SatisComponentsPage();
    satisComponentsPage = await satisComponentsPage.goToPage(navBarPage);
  });

  it('should load Satis', async () => {
    expect(await satisComponentsPage.title.getText()).to.match(/Satis/);
    expect(await satisComponentsPage.createButton.isEnabled()).to.be.true;
  });

  it('should create and delete Satis', async () => {
    const beforeRecordsCount = (await isVisible(satisComponentsPage.noRecords)) ? 0 : await getRecordsCount(satisComponentsPage.table);
    satisUpdatePage = await satisComponentsPage.goToCreateSatis();
    await satisUpdatePage.enterData();

    expect(await satisComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilDisplayed(satisComponentsPage.table);
    await waitUntilCount(satisComponentsPage.records, beforeRecordsCount + 1);
    expect(await satisComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);

    await satisComponentsPage.deleteSatis();
    if (beforeRecordsCount !== 0) {
      await waitUntilCount(satisComponentsPage.records, beforeRecordsCount);
      expect(await satisComponentsPage.records.count()).to.eq(beforeRecordsCount);
    } else {
      await waitUntilDisplayed(satisComponentsPage.noRecords);
    }
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
