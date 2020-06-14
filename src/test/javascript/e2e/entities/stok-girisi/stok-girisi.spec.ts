import { browser, element, by, protractor } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import StokGirisiComponentsPage, { StokGirisiDeleteDialog } from './stok-girisi.page-object';
import StokGirisiUpdatePage from './stok-girisi-update.page-object';
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

describe('StokGirisi e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let stokGirisiComponentsPage: StokGirisiComponentsPage;
  let stokGirisiUpdatePage: StokGirisiUpdatePage;
  let stokGirisiDeleteDialog: StokGirisiDeleteDialog;
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

  it('should load StokGirisis', async () => {
    await navBarPage.getEntityPage('stok-girisi');
    stokGirisiComponentsPage = new StokGirisiComponentsPage();
    expect(await stokGirisiComponentsPage.title.getText()).to.match(/Stok Girisis/);

    expect(await stokGirisiComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilAnyDisplayed([stokGirisiComponentsPage.noRecords, stokGirisiComponentsPage.table]);

    beforeRecordsCount = (await isVisible(stokGirisiComponentsPage.noRecords)) ? 0 : await getRecordsCount(stokGirisiComponentsPage.table);
  });

  it('should load create StokGirisi page', async () => {
    await stokGirisiComponentsPage.createButton.click();
    stokGirisiUpdatePage = new StokGirisiUpdatePage();
    expect(await stokGirisiUpdatePage.getPageTitle().getAttribute('id')).to.match(/koopApp.stokGirisi.home.createOrEditLabel/);
    await stokGirisiUpdatePage.cancel();
  });

  it('should create and save StokGirisis', async () => {
    await stokGirisiComponentsPage.createButton.click();
    await stokGirisiUpdatePage.setMiktarInput('5');
    expect(await stokGirisiUpdatePage.getMiktarInput()).to.eq('5');
    await stokGirisiUpdatePage.setAgirlikInput('5');
    expect(await stokGirisiUpdatePage.getAgirlikInput()).to.eq('5');
    await stokGirisiUpdatePage.setNotlarInput('notlar');
    expect(await stokGirisiUpdatePage.getNotlarInput()).to.match(/notlar/);
    await stokGirisiUpdatePage.stokHareketiTipiSelectLastOption();
    await stokGirisiUpdatePage.setTarihInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
    expect(await stokGirisiUpdatePage.getTarihInput()).to.contain('2001-01-01T02:30');
    await stokGirisiUpdatePage.userSelectLastOption();
    await stokGirisiUpdatePage.urunSelectLastOption();
    await waitUntilDisplayed(stokGirisiUpdatePage.saveButton);
    await stokGirisiUpdatePage.save();
    await waitUntilHidden(stokGirisiUpdatePage.saveButton);
    expect(await isVisible(stokGirisiUpdatePage.saveButton)).to.be.false;

    expect(await stokGirisiComponentsPage.createButton.isEnabled()).to.be.true;

    await waitUntilDisplayed(stokGirisiComponentsPage.table);

    await waitUntilCount(stokGirisiComponentsPage.records, beforeRecordsCount + 1);
    expect(await stokGirisiComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);
  });

  it('should delete last StokGirisi', async () => {
    const deleteButton = stokGirisiComponentsPage.getDeleteButton(stokGirisiComponentsPage.records.last());
    await click(deleteButton);

    stokGirisiDeleteDialog = new StokGirisiDeleteDialog();
    await waitUntilDisplayed(stokGirisiDeleteDialog.deleteModal);
    expect(await stokGirisiDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/koopApp.stokGirisi.delete.question/);
    await stokGirisiDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(stokGirisiDeleteDialog.deleteModal);

    expect(await isVisible(stokGirisiDeleteDialog.deleteModal)).to.be.false;

    await waitUntilAnyDisplayed([stokGirisiComponentsPage.noRecords, stokGirisiComponentsPage.table]);

    const afterCount = (await isVisible(stokGirisiComponentsPage.noRecords)) ? 0 : await getRecordsCount(stokGirisiComponentsPage.table);
    expect(afterCount).to.eq(beforeRecordsCount);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
