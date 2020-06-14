import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import KdvKategorisiComponentsPage, { KdvKategorisiDeleteDialog } from './kdv-kategorisi.page-object';
import KdvKategorisiUpdatePage from './kdv-kategorisi-update.page-object';
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

describe('KdvKategorisi e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let kdvKategorisiComponentsPage: KdvKategorisiComponentsPage;
  let kdvKategorisiUpdatePage: KdvKategorisiUpdatePage;
  let kdvKategorisiDeleteDialog: KdvKategorisiDeleteDialog;
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

  it('should load KdvKategorisis', async () => {
    await navBarPage.getEntityPage('kdv-kategorisi');
    kdvKategorisiComponentsPage = new KdvKategorisiComponentsPage();
    expect(await kdvKategorisiComponentsPage.title.getText()).to.match(/Kdv Kategorisis/);

    expect(await kdvKategorisiComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilAnyDisplayed([kdvKategorisiComponentsPage.noRecords, kdvKategorisiComponentsPage.table]);

    beforeRecordsCount = (await isVisible(kdvKategorisiComponentsPage.noRecords))
      ? 0
      : await getRecordsCount(kdvKategorisiComponentsPage.table);
  });

  it('should load create KdvKategorisi page', async () => {
    await kdvKategorisiComponentsPage.createButton.click();
    kdvKategorisiUpdatePage = new KdvKategorisiUpdatePage();
    expect(await kdvKategorisiUpdatePage.getPageTitle().getAttribute('id')).to.match(/koopApp.kdvKategorisi.home.createOrEditLabel/);
    await kdvKategorisiUpdatePage.cancel();
  });

  it('should create and save KdvKategorisis', async () => {
    await kdvKategorisiComponentsPage.createButton.click();
    await kdvKategorisiUpdatePage.setKategoriAdiInput('kategoriAdi');
    expect(await kdvKategorisiUpdatePage.getKategoriAdiInput()).to.match(/kategoriAdi/);
    await kdvKategorisiUpdatePage.setKdvOraniInput('5');
    expect(await kdvKategorisiUpdatePage.getKdvOraniInput()).to.eq('5');
    await waitUntilDisplayed(kdvKategorisiUpdatePage.saveButton);
    await kdvKategorisiUpdatePage.save();
    await waitUntilHidden(kdvKategorisiUpdatePage.saveButton);
    expect(await isVisible(kdvKategorisiUpdatePage.saveButton)).to.be.false;

    expect(await kdvKategorisiComponentsPage.createButton.isEnabled()).to.be.true;

    await waitUntilDisplayed(kdvKategorisiComponentsPage.table);

    await waitUntilCount(kdvKategorisiComponentsPage.records, beforeRecordsCount + 1);
    expect(await kdvKategorisiComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);
  });

  it('should delete last KdvKategorisi', async () => {
    const deleteButton = kdvKategorisiComponentsPage.getDeleteButton(kdvKategorisiComponentsPage.records.last());
    await click(deleteButton);

    kdvKategorisiDeleteDialog = new KdvKategorisiDeleteDialog();
    await waitUntilDisplayed(kdvKategorisiDeleteDialog.deleteModal);
    expect(await kdvKategorisiDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/koopApp.kdvKategorisi.delete.question/);
    await kdvKategorisiDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(kdvKategorisiDeleteDialog.deleteModal);

    expect(await isVisible(kdvKategorisiDeleteDialog.deleteModal)).to.be.false;

    await waitUntilAnyDisplayed([kdvKategorisiComponentsPage.noRecords, kdvKategorisiComponentsPage.table]);

    const afterCount = (await isVisible(kdvKategorisiComponentsPage.noRecords))
      ? 0
      : await getRecordsCount(kdvKategorisiComponentsPage.table);
    expect(afterCount).to.eq(beforeRecordsCount);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
