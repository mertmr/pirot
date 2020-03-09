import { browser, element, by, protractor } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import KisilerComponentsPage, { KisilerDeleteDialog } from './kisiler.page-object';
import KisilerUpdatePage from './kisiler-update.page-object';
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

describe('Kisiler e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let kisilerComponentsPage: KisilerComponentsPage;
  let kisilerUpdatePage: KisilerUpdatePage;
  let kisilerDeleteDialog: KisilerDeleteDialog;
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

  it('should load Kisilers', async () => {
    await navBarPage.getEntityPage('kisiler');
    kisilerComponentsPage = new KisilerComponentsPage();
    expect(await kisilerComponentsPage.title.getText()).to.match(/Kisilers/);

    expect(await kisilerComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilAnyDisplayed([kisilerComponentsPage.noRecords, kisilerComponentsPage.table]);

    beforeRecordsCount = (await isVisible(kisilerComponentsPage.noRecords)) ? 0 : await getRecordsCount(kisilerComponentsPage.table);
  });

  it('should load create Kisiler page', async () => {
    await kisilerComponentsPage.createButton.click();
    kisilerUpdatePage = new KisilerUpdatePage();
    expect(await kisilerUpdatePage.getPageTitle().getAttribute('id')).to.match(/koopApp.kisiler.home.createOrEditLabel/);
    await kisilerUpdatePage.cancel();
  });

  it('should create and save Kisilers', async () => {
    await kisilerComponentsPage.createButton.click();
    await kisilerUpdatePage.setKisiAdiInput('kisiAdi');
    expect(await kisilerUpdatePage.getKisiAdiInput()).to.match(/kisiAdi/);
    await kisilerUpdatePage.setNotlarInput('notlar');
    expect(await kisilerUpdatePage.getNotlarInput()).to.match(/notlar/);
    await kisilerUpdatePage.setTarihInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
    expect(await kisilerUpdatePage.getTarihInput()).to.contain('2001-01-01T02:30');
    await waitUntilDisplayed(kisilerUpdatePage.saveButton);
    await kisilerUpdatePage.save();
    await waitUntilHidden(kisilerUpdatePage.saveButton);
    expect(await isVisible(kisilerUpdatePage.saveButton)).to.be.false;

    expect(await kisilerComponentsPage.createButton.isEnabled()).to.be.true;

    await waitUntilDisplayed(kisilerComponentsPage.table);

    await waitUntilCount(kisilerComponentsPage.records, beforeRecordsCount + 1);
    expect(await kisilerComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);
  });

  it('should delete last Kisiler', async () => {
    const deleteButton = kisilerComponentsPage.getDeleteButton(kisilerComponentsPage.records.last());
    await click(deleteButton);

    kisilerDeleteDialog = new KisilerDeleteDialog();
    await waitUntilDisplayed(kisilerDeleteDialog.deleteModal);
    expect(await kisilerDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/koopApp.kisiler.delete.question/);
    await kisilerDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(kisilerDeleteDialog.deleteModal);

    expect(await isVisible(kisilerDeleteDialog.deleteModal)).to.be.false;

    await waitUntilAnyDisplayed([kisilerComponentsPage.noRecords, kisilerComponentsPage.table]);

    const afterCount = (await isVisible(kisilerComponentsPage.noRecords)) ? 0 : await getRecordsCount(kisilerComponentsPage.table);
    expect(afterCount).to.eq(beforeRecordsCount);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
