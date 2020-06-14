import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import UrunFiyatHesapComponentsPage, { UrunFiyatHesapDeleteDialog } from './urun-fiyat-hesap.page-object';
import UrunFiyatHesapUpdatePage from './urun-fiyat-hesap-update.page-object';
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

describe('UrunFiyatHesap e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let urunFiyatHesapComponentsPage: UrunFiyatHesapComponentsPage;
  let urunFiyatHesapUpdatePage: UrunFiyatHesapUpdatePage;
  let urunFiyatHesapDeleteDialog: UrunFiyatHesapDeleteDialog;
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

  it('should load UrunFiyatHesaps', async () => {
    await navBarPage.getEntityPage('urun-fiyat-hesap');
    urunFiyatHesapComponentsPage = new UrunFiyatHesapComponentsPage();
    expect(await urunFiyatHesapComponentsPage.title.getText()).to.match(/Urun Fiyat Hesaps/);

    expect(await urunFiyatHesapComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilAnyDisplayed([urunFiyatHesapComponentsPage.noRecords, urunFiyatHesapComponentsPage.table]);

    beforeRecordsCount = (await isVisible(urunFiyatHesapComponentsPage.noRecords))
      ? 0
      : await getRecordsCount(urunFiyatHesapComponentsPage.table);
  });

  it('should load create UrunFiyatHesap page', async () => {
    await urunFiyatHesapComponentsPage.createButton.click();
    urunFiyatHesapUpdatePage = new UrunFiyatHesapUpdatePage();
    expect(await urunFiyatHesapUpdatePage.getPageTitle().getAttribute('id')).to.match(/koopApp.urunFiyatHesap.home.createOrEditLabel/);
    await urunFiyatHesapUpdatePage.cancel();
  });

  it('should create and save UrunFiyatHesaps', async () => {
    await urunFiyatHesapComponentsPage.createButton.click();
    await urunFiyatHesapUpdatePage.setAmortismanInput('5');
    expect(await urunFiyatHesapUpdatePage.getAmortismanInput()).to.eq('5');
    await urunFiyatHesapUpdatePage.setGiderPusulaMustahsilInput('5');
    expect(await urunFiyatHesapUpdatePage.getGiderPusulaMustahsilInput()).to.eq('5');
    await urunFiyatHesapUpdatePage.setDukkanGiderInput('5');
    expect(await urunFiyatHesapUpdatePage.getDukkanGiderInput()).to.eq('5');
    await urunFiyatHesapUpdatePage.setKooperatifCalismaInput('5');
    expect(await urunFiyatHesapUpdatePage.getKooperatifCalismaInput()).to.eq('5');
    await urunFiyatHesapUpdatePage.setDayanismaInput('5');
    expect(await urunFiyatHesapUpdatePage.getDayanismaInput()).to.eq('5');
    await urunFiyatHesapUpdatePage.setFireInput('5');
    expect(await urunFiyatHesapUpdatePage.getFireInput()).to.eq('5');
    await urunFiyatHesapUpdatePage.urunSelectLastOption();
    await waitUntilDisplayed(urunFiyatHesapUpdatePage.saveButton);
    await urunFiyatHesapUpdatePage.save();
    await waitUntilHidden(urunFiyatHesapUpdatePage.saveButton);
    expect(await isVisible(urunFiyatHesapUpdatePage.saveButton)).to.be.false;

    expect(await urunFiyatHesapComponentsPage.createButton.isEnabled()).to.be.true;

    await waitUntilDisplayed(urunFiyatHesapComponentsPage.table);

    await waitUntilCount(urunFiyatHesapComponentsPage.records, beforeRecordsCount + 1);
    expect(await urunFiyatHesapComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);
  });

  it('should delete last UrunFiyatHesap', async () => {
    const deleteButton = urunFiyatHesapComponentsPage.getDeleteButton(urunFiyatHesapComponentsPage.records.last());
    await click(deleteButton);

    urunFiyatHesapDeleteDialog = new UrunFiyatHesapDeleteDialog();
    await waitUntilDisplayed(urunFiyatHesapDeleteDialog.deleteModal);
    expect(await urunFiyatHesapDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/koopApp.urunFiyatHesap.delete.question/);
    await urunFiyatHesapDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(urunFiyatHesapDeleteDialog.deleteModal);

    expect(await isVisible(urunFiyatHesapDeleteDialog.deleteModal)).to.be.false;

    await waitUntilAnyDisplayed([urunFiyatHesapComponentsPage.noRecords, urunFiyatHesapComponentsPage.table]);

    const afterCount = (await isVisible(urunFiyatHesapComponentsPage.noRecords))
      ? 0
      : await getRecordsCount(urunFiyatHesapComponentsPage.table);
    expect(afterCount).to.eq(beforeRecordsCount);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
