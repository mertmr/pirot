import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import SatisStokHareketleriComponentsPage from './satis-stok-hareketleri.page-object';
import SatisStokHareketleriUpdatePage from './satis-stok-hareketleri-update.page-object';
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

describe('SatisStokHareketleri e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let satisStokHareketleriComponentsPage: SatisStokHareketleriComponentsPage;
  let satisStokHareketleriUpdatePage: SatisStokHareketleriUpdatePage;
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
    satisStokHareketleriComponentsPage = new SatisStokHareketleriComponentsPage();
    satisStokHareketleriComponentsPage = await satisStokHareketleriComponentsPage.goToPage(navBarPage);
  });

  it('should load SatisStokHareketleris', async () => {
    expect(await satisStokHareketleriComponentsPage.title.getText()).to.match(/Satis Stok Hareketleris/);
    expect(await satisStokHareketleriComponentsPage.createButton.isEnabled()).to.be.true;
  });

  it('should create and delete SatisStokHareketleris', async () => {
    const beforeRecordsCount = (await isVisible(satisStokHareketleriComponentsPage.noRecords))
      ? 0
      : await getRecordsCount(satisStokHareketleriComponentsPage.table);
    satisStokHareketleriUpdatePage = await satisStokHareketleriComponentsPage.goToCreateSatisStokHareketleri();
    await satisStokHareketleriUpdatePage.enterData();

    expect(await satisStokHareketleriComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilDisplayed(satisStokHareketleriComponentsPage.table);
    await waitUntilCount(satisStokHareketleriComponentsPage.records, beforeRecordsCount + 1);
    expect(await satisStokHareketleriComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);

    await satisStokHareketleriComponentsPage.deleteSatisStokHareketleri();
    if (beforeRecordsCount !== 0) {
      await waitUntilCount(satisStokHareketleriComponentsPage.records, beforeRecordsCount);
      expect(await satisStokHareketleriComponentsPage.records.count()).to.eq(beforeRecordsCount);
    } else {
      await waitUntilDisplayed(satisStokHareketleriComponentsPage.noRecords);
    }
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
