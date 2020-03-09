import { browser, element, by, protractor } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import NobetHareketleriComponentsPage, { NobetHareketleriDeleteDialog } from './nobet-hareketleri.page-object';
import NobetHareketleriUpdatePage from './nobet-hareketleri-update.page-object';
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

describe('NobetHareketleri e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let nobetHareketleriComponentsPage: NobetHareketleriComponentsPage;
  let nobetHareketleriUpdatePage: NobetHareketleriUpdatePage;
  let nobetHareketleriDeleteDialog: NobetHareketleriDeleteDialog;
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

  it('should load NobetHareketleris', async () => {
    await navBarPage.getEntityPage('nobet-hareketleri');
    nobetHareketleriComponentsPage = new NobetHareketleriComponentsPage();
    expect(await nobetHareketleriComponentsPage.title.getText()).to.match(/Nobet Hareketleris/);

    expect(await nobetHareketleriComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilAnyDisplayed([nobetHareketleriComponentsPage.noRecords, nobetHareketleriComponentsPage.table]);

    beforeRecordsCount = (await isVisible(nobetHareketleriComponentsPage.noRecords))
      ? 0
      : await getRecordsCount(nobetHareketleriComponentsPage.table);
  });

  it('should load create NobetHareketleri page', async () => {
    await nobetHareketleriComponentsPage.createButton.click();
    nobetHareketleriUpdatePage = new NobetHareketleriUpdatePage();
    expect(await nobetHareketleriUpdatePage.getPageTitle().getAttribute('id')).to.match(/koopApp.nobetHareketleri.home.createOrEditLabel/);
    await nobetHareketleriUpdatePage.cancel();
  });

  it('should create and save NobetHareketleris', async () => {
    await nobetHareketleriComponentsPage.createButton.click();
    await nobetHareketleriUpdatePage.setKasaInput('5');
    expect(await nobetHareketleriUpdatePage.getKasaInput()).to.eq('5');
    await nobetHareketleriUpdatePage.setPirotInput('5');
    expect(await nobetHareketleriUpdatePage.getPirotInput()).to.eq('5');
    await nobetHareketleriUpdatePage.setFarkInput('5');
    expect(await nobetHareketleriUpdatePage.getFarkInput()).to.eq('5');
    await nobetHareketleriUpdatePage.setNobetSuresiInput('5');
    expect(await nobetHareketleriUpdatePage.getNobetSuresiInput()).to.eq('5');
    await nobetHareketleriUpdatePage.setNotlarInput('notlar');
    expect(await nobetHareketleriUpdatePage.getNotlarInput()).to.match(/notlar/);
    await nobetHareketleriUpdatePage.setTarihInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
    expect(await nobetHareketleriUpdatePage.getTarihInput()).to.contain('2001-01-01T02:30');
    await nobetHareketleriUpdatePage.userSelectLastOption();
    await waitUntilDisplayed(nobetHareketleriUpdatePage.saveButton);
    await nobetHareketleriUpdatePage.save();
    await waitUntilHidden(nobetHareketleriUpdatePage.saveButton);
    expect(await isVisible(nobetHareketleriUpdatePage.saveButton)).to.be.false;

    expect(await nobetHareketleriComponentsPage.createButton.isEnabled()).to.be.true;

    await waitUntilDisplayed(nobetHareketleriComponentsPage.table);

    await waitUntilCount(nobetHareketleriComponentsPage.records, beforeRecordsCount + 1);
    expect(await nobetHareketleriComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);
  });

  it('should delete last NobetHareketleri', async () => {
    const deleteButton = nobetHareketleriComponentsPage.getDeleteButton(nobetHareketleriComponentsPage.records.last());
    await click(deleteButton);

    nobetHareketleriDeleteDialog = new NobetHareketleriDeleteDialog();
    await waitUntilDisplayed(nobetHareketleriDeleteDialog.deleteModal);
    expect(await nobetHareketleriDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/koopApp.nobetHareketleri.delete.question/);
    await nobetHareketleriDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(nobetHareketleriDeleteDialog.deleteModal);

    expect(await isVisible(nobetHareketleriDeleteDialog.deleteModal)).to.be.false;

    await waitUntilAnyDisplayed([nobetHareketleriComponentsPage.noRecords, nobetHareketleriComponentsPage.table]);

    const afterCount = (await isVisible(nobetHareketleriComponentsPage.noRecords))
      ? 0
      : await getRecordsCount(nobetHareketleriComponentsPage.table);
    expect(afterCount).to.eq(beforeRecordsCount);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
