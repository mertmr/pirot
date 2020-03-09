import { browser, element, by, protractor } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import BorcAlacakComponentsPage, { BorcAlacakDeleteDialog } from './borc-alacak.page-object';
import BorcAlacakUpdatePage from './borc-alacak-update.page-object';
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

describe('BorcAlacak e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let borcAlacakComponentsPage: BorcAlacakComponentsPage;
  let borcAlacakUpdatePage: BorcAlacakUpdatePage;
  let borcAlacakDeleteDialog: BorcAlacakDeleteDialog;
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

  it('should load BorcAlacaks', async () => {
    await navBarPage.getEntityPage('borc-alacak');
    borcAlacakComponentsPage = new BorcAlacakComponentsPage();
    expect(await borcAlacakComponentsPage.title.getText()).to.match(/Borc Alacaks/);

    expect(await borcAlacakComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilAnyDisplayed([borcAlacakComponentsPage.noRecords, borcAlacakComponentsPage.table]);

    beforeRecordsCount = (await isVisible(borcAlacakComponentsPage.noRecords)) ? 0 : await getRecordsCount(borcAlacakComponentsPage.table);
  });

  it('should load create BorcAlacak page', async () => {
    await borcAlacakComponentsPage.createButton.click();
    borcAlacakUpdatePage = new BorcAlacakUpdatePage();
    expect(await borcAlacakUpdatePage.getPageTitle().getAttribute('id')).to.match(/koopApp.borcAlacak.home.createOrEditLabel/);
    await borcAlacakUpdatePage.cancel();
  });

  it('should create and save BorcAlacaks', async () => {
    await borcAlacakComponentsPage.createButton.click();
    await borcAlacakUpdatePage.setTutarInput('5');
    expect(await borcAlacakUpdatePage.getTutarInput()).to.eq('5');
    await borcAlacakUpdatePage.setNotlarInput('notlar');
    expect(await borcAlacakUpdatePage.getNotlarInput()).to.match(/notlar/);
    await borcAlacakUpdatePage.odemeAraciSelectLastOption();
    await borcAlacakUpdatePage.hareketTipiSelectLastOption();
    await borcAlacakUpdatePage.setTarihInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
    expect(await borcAlacakUpdatePage.getTarihInput()).to.contain('2001-01-01T02:30');
    await borcAlacakUpdatePage.userSelectLastOption();
    await borcAlacakUpdatePage.urunSelectLastOption();
    await waitUntilDisplayed(borcAlacakUpdatePage.saveButton);
    await borcAlacakUpdatePage.save();
    await waitUntilHidden(borcAlacakUpdatePage.saveButton);
    expect(await isVisible(borcAlacakUpdatePage.saveButton)).to.be.false;

    expect(await borcAlacakComponentsPage.createButton.isEnabled()).to.be.true;

    await waitUntilDisplayed(borcAlacakComponentsPage.table);

    await waitUntilCount(borcAlacakComponentsPage.records, beforeRecordsCount + 1);
    expect(await borcAlacakComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);
  });

  it('should delete last BorcAlacak', async () => {
    const deleteButton = borcAlacakComponentsPage.getDeleteButton(borcAlacakComponentsPage.records.last());
    await click(deleteButton);

    borcAlacakDeleteDialog = new BorcAlacakDeleteDialog();
    await waitUntilDisplayed(borcAlacakDeleteDialog.deleteModal);
    expect(await borcAlacakDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/koopApp.borcAlacak.delete.question/);
    await borcAlacakDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(borcAlacakDeleteDialog.deleteModal);

    expect(await isVisible(borcAlacakDeleteDialog.deleteModal)).to.be.false;

    await waitUntilAnyDisplayed([borcAlacakComponentsPage.noRecords, borcAlacakComponentsPage.table]);

    const afterCount = (await isVisible(borcAlacakComponentsPage.noRecords)) ? 0 : await getRecordsCount(borcAlacakComponentsPage.table);
    expect(afterCount).to.eq(beforeRecordsCount);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
