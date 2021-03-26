import { element, by, ElementFinder, ElementArrayFinder } from 'protractor';

import { waitUntilAnyDisplayed, waitUntilDisplayed, click, waitUntilHidden, isVisible } from '../../util/utils';

import NavBarPage from './../../page-objects/navbar-page';

import NobetHareketleriUpdatePage from './nobet-hareketleri-update.page-object';

const expect = chai.expect;
export class NobetHareketleriDeleteDialog {
  deleteModal = element(by.className('modal'));
  private dialogTitle: ElementFinder = element(by.id('koopApp.nobetHareketleri.delete.question'));
  private confirmButton = element(by.id('koop-confirm-delete-nobetHareketleri'));

  getDialogTitle() {
    return this.dialogTitle;
  }

  async clickOnConfirmButton() {
    await this.confirmButton.click();
  }
}

export default class NobetHareketleriComponentsPage {
  createButton: ElementFinder = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('div table .btn-danger'));
  title: ElementFinder = element(by.id('nobet-hareketleri-heading'));
  noRecords: ElementFinder = element(by.css('#app-view-container .table-responsive div.alert.alert-warning'));
  table: ElementFinder = element(by.css('#app-view-container div.table-responsive > table'));

  records: ElementArrayFinder = this.table.all(by.css('tbody tr'));

  getDetailsButton(record: ElementFinder) {
    return record.element(by.css('a.btn.btn-info.btn-sm'));
  }

  getEditButton(record: ElementFinder) {
    return record.element(by.css('a.btn.btn-primary.btn-sm'));
  }

  getDeleteButton(record: ElementFinder) {
    return record.element(by.css('a.btn.btn-danger.btn-sm'));
  }

  async goToPage(navBarPage: NavBarPage) {
    await navBarPage.getEntityPage('nobet-hareketleri');
    await waitUntilAnyDisplayed([this.noRecords, this.table]);
    return this;
  }

  async goToCreateNobetHareketleri() {
    await this.createButton.click();
    return new NobetHareketleriUpdatePage();
  }

  async deleteNobetHareketleri() {
    const deleteButton = this.getDeleteButton(this.records.last());
    await click(deleteButton);

    const nobetHareketleriDeleteDialog = new NobetHareketleriDeleteDialog();
    await waitUntilDisplayed(nobetHareketleriDeleteDialog.deleteModal);
    expect(await nobetHareketleriDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/koopApp.nobetHareketleri.delete.question/);
    await nobetHareketleriDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(nobetHareketleriDeleteDialog.deleteModal);

    expect(await isVisible(nobetHareketleriDeleteDialog.deleteModal)).to.be.false;
  }
}
