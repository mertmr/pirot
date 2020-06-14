import { browser, element, by, protractor } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import KasaHareketleriComponentsPage, { KasaHareketleriDeleteDialog } from './kasa-hareketleri.page-object';
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
  let kasaHareketleriDeleteDialog: KasaHareketleriDeleteDialog;
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

  it('should load KasaHareketleris', async () => {
    await navBarPage.getEntityPage('kasa-hareketleri');
    kasaHareketleriComponentsPage = new KasaHareketleriComponentsPage();
    expect(await kasaHareketleriComponentsPage.title.getText()).to.match(/Kasa Hareketleris/);

    expect(await kasaHareketleriComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilAnyDisplayed([kasaHareketleriComponentsPage.noRecords, kasaHareketleriComponentsPage.table]);

    beforeRecordsCount = (await isVisible(kasaHareketleriComponentsPage.noRecords))
      ? 0
      : await getRecordsCount(kasaHareketleriComponentsPage.table);
  });

  it('should load create KasaHareketleri page', async () => {
    await kasaHareketleriComponentsPage.createButton.click();
    kasaHareketleriUpdatePage = new KasaHareketleriUpdatePage();
    expect(await kasaHareketleriUpdatePage.getPageTitle().getAttribute('id')).to.match(/koopApp.kasaHareketleri.home.createOrEditLabel/);
    await kasaHareketleriUpdatePage.cancel();
  });

  it('should create and save KasaHareketleris', async () => {
    await kasaHareketleriComponentsPage.createButton.click();
    await kasaHareketleriUpdatePage.setKasaMiktarInput('5');
    expect(await kasaHareketleriUpdatePage.getKasaMiktarInput()).to.eq('5');
    await kasaHareketleriUpdatePage.setHareketInput('hareket');
    expect(await kasaHareketleriUpdatePage.getHareketInput()).to.match(/hareket/);
    await kasaHareketleriUpdatePage.setTarihInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
    expect(await kasaHareketleriUpdatePage.getTarihInput()).to.contain('2001-01-01T02:30');
    await waitUntilDisplayed(kasaHareketleriUpdatePage.saveButton);
    await kasaHareketleriUpdatePage.save();
    await waitUntilHidden(kasaHareketleriUpdatePage.saveButton);
    expect(await isVisible(kasaHareketleriUpdatePage.saveButton)).to.be.false;

    expect(await kasaHareketleriComponentsPage.createButton.isEnabled()).to.be.true;

    await waitUntilDisplayed(kasaHareketleriComponentsPage.table);

    await waitUntilCount(kasaHareketleriComponentsPage.records, beforeRecordsCount + 1);
    expect(await kasaHareketleriComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);
  });

  it('should delete last KasaHareketleri', async () => {
    const deleteButton = kasaHareketleriComponentsPage.getDeleteButton(kasaHareketleriComponentsPage.records.last());
    await click(deleteButton);

    kasaHareketleriDeleteDialog = new KasaHareketleriDeleteDialog();
    await waitUntilDisplayed(kasaHareketleriDeleteDialog.deleteModal);
    expect(await kasaHareketleriDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/koopApp.kasaHareketleri.delete.question/);
    await kasaHareketleriDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(kasaHareketleriDeleteDialog.deleteModal);

    expect(await isVisible(kasaHareketleriDeleteDialog.deleteModal)).to.be.false;

    await waitUntilAnyDisplayed([kasaHareketleriComponentsPage.noRecords, kasaHareketleriComponentsPage.table]);

    const afterCount = (await isVisible(kasaHareketleriComponentsPage.noRecords))
      ? 0
      : await getRecordsCount(kasaHareketleriComponentsPage.table);
    expect(afterCount).to.eq(beforeRecordsCount);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
