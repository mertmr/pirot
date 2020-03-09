import { browser, element, by, protractor } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import UrunFiyatComponentsPage, { UrunFiyatDeleteDialog } from './urun-fiyat.page-object';
import UrunFiyatUpdatePage from './urun-fiyat-update.page-object';
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

describe('UrunFiyat e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let urunFiyatComponentsPage: UrunFiyatComponentsPage;
  let urunFiyatUpdatePage: UrunFiyatUpdatePage;
  let urunFiyatDeleteDialog: UrunFiyatDeleteDialog;
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

  it('should load UrunFiyats', async () => {
    await navBarPage.getEntityPage('urun-fiyat');
    urunFiyatComponentsPage = new UrunFiyatComponentsPage();
    expect(await urunFiyatComponentsPage.title.getText()).to.match(/Urun Fiyats/);

    expect(await urunFiyatComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilAnyDisplayed([urunFiyatComponentsPage.noRecords, urunFiyatComponentsPage.table]);

    beforeRecordsCount = (await isVisible(urunFiyatComponentsPage.noRecords)) ? 0 : await getRecordsCount(urunFiyatComponentsPage.table);
  });

  it('should load create UrunFiyat page', async () => {
    await urunFiyatComponentsPage.createButton.click();
    urunFiyatUpdatePage = new UrunFiyatUpdatePage();
    expect(await urunFiyatUpdatePage.getPageTitle().getAttribute('id')).to.match(/koopApp.urunFiyat.home.createOrEditLabel/);
    await urunFiyatUpdatePage.cancel();
  });

  it('should create and save UrunFiyats', async () => {
    await urunFiyatComponentsPage.createButton.click();
    await urunFiyatUpdatePage.setFiyatInput('5');
    expect(await urunFiyatUpdatePage.getFiyatInput()).to.eq('5');
    await urunFiyatUpdatePage.setTarihInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
    expect(await urunFiyatUpdatePage.getTarihInput()).to.contain('2001-01-01T02:30');
    await urunFiyatUpdatePage.userSelectLastOption();
    await urunFiyatUpdatePage.urunSelectLastOption();
    await waitUntilDisplayed(urunFiyatUpdatePage.saveButton);
    await urunFiyatUpdatePage.save();
    await waitUntilHidden(urunFiyatUpdatePage.saveButton);
    expect(await isVisible(urunFiyatUpdatePage.saveButton)).to.be.false;

    expect(await urunFiyatComponentsPage.createButton.isEnabled()).to.be.true;

    await waitUntilDisplayed(urunFiyatComponentsPage.table);

    await waitUntilCount(urunFiyatComponentsPage.records, beforeRecordsCount + 1);
    expect(await urunFiyatComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);
  });

  it('should delete last UrunFiyat', async () => {
    const deleteButton = urunFiyatComponentsPage.getDeleteButton(urunFiyatComponentsPage.records.last());
    await click(deleteButton);

    urunFiyatDeleteDialog = new UrunFiyatDeleteDialog();
    await waitUntilDisplayed(urunFiyatDeleteDialog.deleteModal);
    expect(await urunFiyatDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/koopApp.urunFiyat.delete.question/);
    await urunFiyatDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(urunFiyatDeleteDialog.deleteModal);

    expect(await isVisible(urunFiyatDeleteDialog.deleteModal)).to.be.false;

    await waitUntilAnyDisplayed([urunFiyatComponentsPage.noRecords, urunFiyatComponentsPage.table]);

    const afterCount = (await isVisible(urunFiyatComponentsPage.noRecords)) ? 0 : await getRecordsCount(urunFiyatComponentsPage.table);
    expect(afterCount).to.eq(beforeRecordsCount);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
