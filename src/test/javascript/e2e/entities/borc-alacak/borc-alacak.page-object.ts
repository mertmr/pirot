import { element, by, ElementFinder, ElementArrayFinder } from 'protractor';

import { waitUntilAnyDisplayed, waitUntilDisplayed, click, waitUntilHidden, isVisible } from '../../util/utils';

import NavBarPage from './../../page-objects/navbar-page';

import BorcAlacakUpdatePage from './borc-alacak-update.page-object';

const expect = chai.expect;
export class BorcAlacakDeleteDialog {
  deleteModal = element(by.className('modal'));
  private dialogTitle: ElementFinder = element(by.id('koopApp.borcAlacak.delete.question'));
  private confirmButton = element(by.id('koop-confirm-delete-borcAlacak'));

  getDialogTitle() {
    return this.dialogTitle;
  }

  async clickOnConfirmButton() {
    await this.confirmButton.click();
  }
}

export default class BorcAlacakComponentsPage {
  createButton: ElementFinder = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('div table .btn-danger'));
  title: ElementFinder = element(by.id('borc-alacak-heading'));
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
    await navBarPage.getEntityPage('borc-alacak');
    await waitUntilAnyDisplayed([this.noRecords, this.table]);
    return this;
  }

  async goToCreateBorcAlacak() {
    await this.createButton.click();
    return new BorcAlacakUpdatePage();
  }

  async deleteBorcAlacak() {
    const deleteButton = this.getDeleteButton(this.records.last());
    await click(deleteButton);

    const borcAlacakDeleteDialog = new BorcAlacakDeleteDialog();
    await waitUntilDisplayed(borcAlacakDeleteDialog.deleteModal);
    expect(await borcAlacakDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/koopApp.borcAlacak.delete.question/);
    await borcAlacakDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(borcAlacakDeleteDialog.deleteModal);

    expect(await isVisible(borcAlacakDeleteDialog.deleteModal)).to.be.false;
  }
}
