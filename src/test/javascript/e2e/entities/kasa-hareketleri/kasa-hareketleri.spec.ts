import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import KasaHareketleriComponentsPage from './kasa-hareketleri.page-object';
import KasaHareketleriUpdatePage from './kasa-hareketleri-update.page-object';
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

describe('KasaHareketleri e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let kasaHareketleriComponentsPage: KasaHareketleriComponentsPage;
  let kasaHareketleriUpdatePage: KasaHareketleriUpdatePage;

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
    kasaHareketleriComponentsPage = new KasaHareketleriComponentsPage();
    kasaHareketleriComponentsPage = await kasaHareketleriComponentsPage.goToPage(navBarPage);
  });

  it('should load KasaHareketleris', async () => {
    expect(await kasaHareketleriComponentsPage.title.getText()).to.match(/Kasa Hareketleris/);
    expect(await kasaHareketleriComponentsPage.createButton.isEnabled()).to.be.true;
  });

  it('should create and delete KasaHareketleris', async () => {
    const beforeRecordsCount = (await isVisible(kasaHareketleriComponentsPage.noRecords))
      ? 0
      : await getRecordsCount(kasaHareketleriComponentsPage.table);
    kasaHareketleriUpdatePage = await kasaHareketleriComponentsPage.goToCreateKasaHareketleri();
    await kasaHareketleriUpdatePage.enterData();

    expect(await kasaHareketleriComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilDisplayed(kasaHareketleriComponentsPage.table);
    await waitUntilCount(kasaHareketleriComponentsPage.records, beforeRecordsCount + 1);
    expect(await kasaHareketleriComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);

    await kasaHareketleriComponentsPage.deleteKasaHareketleri();
    if (beforeRecordsCount !== 0) {
      await waitUntilCount(kasaHareketleriComponentsPage.records, beforeRecordsCount);
      expect(await kasaHareketleriComponentsPage.records.count()).to.eq(beforeRecordsCount);
    } else {
      await waitUntilDisplayed(kasaHareketleriComponentsPage.noRecords);
    }
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
