import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import UrunComponentsPage, { UrunDeleteDialog } from './urun.page-object';
import UrunUpdatePage from './urun-update.page-object';
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

describe('Urun e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let urunComponentsPage: UrunComponentsPage;
  let urunUpdatePage: UrunUpdatePage;
  let urunDeleteDialog: UrunDeleteDialog;
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

  it('should load Uruns', async () => {
    await navBarPage.getEntityPage('urun');
    urunComponentsPage = new UrunComponentsPage();
    expect(await urunComponentsPage.title.getText()).to.match(/Uruns/);

    expect(await urunComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilAnyDisplayed([urunComponentsPage.noRecords, urunComponentsPage.table]);

    beforeRecordsCount = (await isVisible(urunComponentsPage.noRecords)) ? 0 : await getRecordsCount(urunComponentsPage.table);
  });

  it('should load create Urun page', async () => {
    await urunComponentsPage.createButton.click();
    urunUpdatePage = new UrunUpdatePage();
    expect(await urunUpdatePage.getPageTitle().getAttribute('id')).to.match(/koopApp.urun.home.createOrEditLabel/);
    await urunUpdatePage.cancel();
  });

  it('should create and save Uruns', async () => {
    await urunComponentsPage.createButton.click();
    await urunUpdatePage.setUrunAdiInput('urunAdi');
    expect(await urunUpdatePage.getUrunAdiInput()).to.match(/urunAdi/);
    await urunUpdatePage.setStokInput('5');
    expect(await urunUpdatePage.getStokInput()).to.eq('5');
    await urunUpdatePage.setStokSiniriInput('5');
    expect(await urunUpdatePage.getStokSiniriInput()).to.eq('5');
    await urunUpdatePage.setMusteriFiyatiInput('5');
    expect(await urunUpdatePage.getMusteriFiyatiInput()).to.eq('5');
    await urunUpdatePage.birimSelectLastOption();
    const selectedDayanismaUrunu = await urunUpdatePage.getDayanismaUrunuInput().isSelected();
    if (selectedDayanismaUrunu) {
      await urunUpdatePage.getDayanismaUrunuInput().click();
      expect(await urunUpdatePage.getDayanismaUrunuInput().isSelected()).to.be.false;
    } else {
      await urunUpdatePage.getDayanismaUrunuInput().click();
      expect(await urunUpdatePage.getDayanismaUrunuInput().isSelected()).to.be.true;
    }
    const selectedSatista = await urunUpdatePage.getSatistaInput().isSelected();
    if (selectedSatista) {
      await urunUpdatePage.getSatistaInput().click();
      expect(await urunUpdatePage.getSatistaInput().isSelected()).to.be.false;
    } else {
      await urunUpdatePage.getSatistaInput().click();
      expect(await urunUpdatePage.getSatistaInput().isSelected()).to.be.true;
    }
    await urunUpdatePage.urunKategorisiSelectLastOption();
    const selectedActive = await urunUpdatePage.getActiveInput().isSelected();
    if (selectedActive) {
      await urunUpdatePage.getActiveInput().click();
      expect(await urunUpdatePage.getActiveInput().isSelected()).to.be.false;
    } else {
      await urunUpdatePage.getActiveInput().click();
      expect(await urunUpdatePage.getActiveInput().isSelected()).to.be.true;
    }
    await urunUpdatePage.urunSorumlusuSelectLastOption();
    await urunUpdatePage.kdvKategorisiSelectLastOption();
    await waitUntilDisplayed(urunUpdatePage.saveButton);
    await urunUpdatePage.save();
    await waitUntilHidden(urunUpdatePage.saveButton);
    expect(await isVisible(urunUpdatePage.saveButton)).to.be.false;

    expect(await urunComponentsPage.createButton.isEnabled()).to.be.true;

    await waitUntilDisplayed(urunComponentsPage.table);

    await waitUntilCount(urunComponentsPage.records, beforeRecordsCount + 1);
    expect(await urunComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);
  });

  it('should delete last Urun', async () => {
    const deleteButton = urunComponentsPage.getDeleteButton(urunComponentsPage.records.last());
    await click(deleteButton);

    urunDeleteDialog = new UrunDeleteDialog();
    await waitUntilDisplayed(urunDeleteDialog.deleteModal);
    expect(await urunDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/koopApp.urun.delete.question/);
    await urunDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(urunDeleteDialog.deleteModal);

    expect(await isVisible(urunDeleteDialog.deleteModal)).to.be.false;

    await waitUntilAnyDisplayed([urunComponentsPage.noRecords, urunComponentsPage.table]);

    const afterCount = (await isVisible(urunComponentsPage.noRecords)) ? 0 : await getRecordsCount(urunComponentsPage.table);
    expect(afterCount).to.eq(beforeRecordsCount);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
