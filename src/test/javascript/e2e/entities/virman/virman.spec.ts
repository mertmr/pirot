import { browser, element, by, protractor } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import VirmanComponentsPage, { VirmanDeleteDialog } from './virman.page-object';
import VirmanUpdatePage from './virman-update.page-object';
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

describe('Virman e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let virmanComponentsPage: VirmanComponentsPage;
  let virmanUpdatePage: VirmanUpdatePage;
  let virmanDeleteDialog: VirmanDeleteDialog;
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

  it('should load Virmen', async () => {
    await navBarPage.getEntityPage('virman');
    virmanComponentsPage = new VirmanComponentsPage();
    expect(await virmanComponentsPage.title.getText()).to.match(/Virmen/);

    expect(await virmanComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilAnyDisplayed([virmanComponentsPage.noRecords, virmanComponentsPage.table]);

    beforeRecordsCount = (await isVisible(virmanComponentsPage.noRecords)) ? 0 : await getRecordsCount(virmanComponentsPage.table);
  });

  it('should load create Virman page', async () => {
    await virmanComponentsPage.createButton.click();
    virmanUpdatePage = new VirmanUpdatePage();
    expect(await virmanUpdatePage.getPageTitle().getAttribute('id')).to.match(/koopApp.virman.home.createOrEditLabel/);
    await virmanUpdatePage.cancel();
  });

  it('should create and save Virmen', async () => {
    await virmanComponentsPage.createButton.click();
    await virmanUpdatePage.setTutarInput('5');
    expect(await virmanUpdatePage.getTutarInput()).to.eq('5');
    await virmanUpdatePage.setNotlarInput('notlar');
    expect(await virmanUpdatePage.getNotlarInput()).to.match(/notlar/);
    await virmanUpdatePage.cikisHesabiSelectLastOption();
    await virmanUpdatePage.girisHesabiSelectLastOption();
    await virmanUpdatePage.setTarihInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
    expect(await virmanUpdatePage.getTarihInput()).to.contain('2001-01-01T02:30');
    await virmanUpdatePage.userSelectLastOption();
    await waitUntilDisplayed(virmanUpdatePage.saveButton);
    await virmanUpdatePage.save();
    await waitUntilHidden(virmanUpdatePage.saveButton);
    expect(await isVisible(virmanUpdatePage.saveButton)).to.be.false;

    expect(await virmanComponentsPage.createButton.isEnabled()).to.be.true;

    await waitUntilDisplayed(virmanComponentsPage.table);

    await waitUntilCount(virmanComponentsPage.records, beforeRecordsCount + 1);
    expect(await virmanComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);
  });

  it('should delete last Virman', async () => {
    const deleteButton = virmanComponentsPage.getDeleteButton(virmanComponentsPage.records.last());
    await click(deleteButton);

    virmanDeleteDialog = new VirmanDeleteDialog();
    await waitUntilDisplayed(virmanDeleteDialog.deleteModal);
    expect(await virmanDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/koopApp.virman.delete.question/);
    await virmanDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(virmanDeleteDialog.deleteModal);

    expect(await isVisible(virmanDeleteDialog.deleteModal)).to.be.false;

    await waitUntilAnyDisplayed([virmanComponentsPage.noRecords, virmanComponentsPage.table]);

    const afterCount = (await isVisible(virmanComponentsPage.noRecords)) ? 0 : await getRecordsCount(virmanComponentsPage.table);
    expect(afterCount).to.eq(beforeRecordsCount);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
