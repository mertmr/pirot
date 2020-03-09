import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import SatisStokHareketleriComponentsPage, { SatisStokHareketleriDeleteDialog } from './satis-stok-hareketleri.page-object';
import SatisStokHareketleriUpdatePage from './satis-stok-hareketleri-update.page-object';
import {
  waitUntilDisplayed,
  waitUntilAnyDisplayed,
  click,
  getRecordsCount,
  waitUntilHidden,
  waitUntilCount,
  isVisible
} from '../../util/utils';

const expect = chai.expect;

describe('SatisStokHareketleri e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let satisStokHareketleriComponentsPage: SatisStokHareketleriComponentsPage;
  let satisStokHareketleriUpdatePage: SatisStokHareketleriUpdatePage;
  let satisStokHareketleriDeleteDialog: SatisStokHareketleriDeleteDialog;
  let beforeRecordsCount = 0;

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

  it('should load SatisStokHareketleris', async () => {
    await navBarPage.getEntityPage('satis-stok-hareketleri');
    satisStokHareketleriComponentsPage = new SatisStokHareketleriComponentsPage();
    expect(await satisStokHareketleriComponentsPage.title.getText()).to.match(/Satis Stok Hareketleris/);

    expect(await satisStokHareketleriComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilAnyDisplayed([satisStokHareketleriComponentsPage.noRecords, satisStokHareketleriComponentsPage.table]);

    beforeRecordsCount = (await isVisible(satisStokHareketleriComponentsPage.noRecords))
      ? 0
      : await getRecordsCount(satisStokHareketleriComponentsPage.table);
  });

  it('should load create SatisStokHareketleri page', async () => {
    await satisStokHareketleriComponentsPage.createButton.click();
    satisStokHareketleriUpdatePage = new SatisStokHareketleriUpdatePage();
    expect(await satisStokHareketleriUpdatePage.getPageTitle().getAttribute('id')).to.match(
      /koopApp.satisStokHareketleri.home.createOrEditLabel/
    );
    await satisStokHareketleriUpdatePage.cancel();
  });

  it('should create and save SatisStokHareketleris', async () => {
    await satisStokHareketleriComponentsPage.createButton.click();
    await satisStokHareketleriUpdatePage.setMiktarInput('5');
    expect(await satisStokHareketleriUpdatePage.getMiktarInput()).to.eq('5');
    await satisStokHareketleriUpdatePage.setTutarInput('5');
    expect(await satisStokHareketleriUpdatePage.getTutarInput()).to.eq('5');
    await satisStokHareketleriUpdatePage.urunSelectLastOption();
    await satisStokHareketleriUpdatePage.satisSelectLastOption();
    await waitUntilDisplayed(satisStokHareketleriUpdatePage.saveButton);
    await satisStokHareketleriUpdatePage.save();
    await waitUntilHidden(satisStokHareketleriUpdatePage.saveButton);
    expect(await isVisible(satisStokHareketleriUpdatePage.saveButton)).to.be.false;

    expect(await satisStokHareketleriComponentsPage.createButton.isEnabled()).to.be.true;

    await waitUntilDisplayed(satisStokHareketleriComponentsPage.table);

    await waitUntilCount(satisStokHareketleriComponentsPage.records, beforeRecordsCount + 1);
    expect(await satisStokHareketleriComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);
  });

  it('should delete last SatisStokHareketleri', async () => {
    const deleteButton = satisStokHareketleriComponentsPage.getDeleteButton(satisStokHareketleriComponentsPage.records.last());
    await click(deleteButton);

    satisStokHareketleriDeleteDialog = new SatisStokHareketleriDeleteDialog();
    await waitUntilDisplayed(satisStokHareketleriDeleteDialog.deleteModal);
    expect(await satisStokHareketleriDeleteDialog.getDialogTitle().getAttribute('id')).to.match(
      /koopApp.satisStokHareketleri.delete.question/
    );
    await satisStokHareketleriDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(satisStokHareketleriDeleteDialog.deleteModal);

    expect(await isVisible(satisStokHareketleriDeleteDialog.deleteModal)).to.be.false;

    await waitUntilAnyDisplayed([satisStokHareketleriComponentsPage.noRecords, satisStokHareketleriComponentsPage.table]);

    const afterCount = (await isVisible(satisStokHareketleriComponentsPage.noRecords))
      ? 0
      : await getRecordsCount(satisStokHareketleriComponentsPage.table);
    expect(afterCount).to.eq(beforeRecordsCount);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
