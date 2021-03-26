import { element, by, ElementFinder, ElementArrayFinder } from 'protractor';

import { waitUntilAnyDisplayed, waitUntilDisplayed, click, waitUntilHidden, isVisible } from '../../util/utils';

import NavBarPage from './../../page-objects/navbar-page';

import KisilerUpdatePage from './kisiler-update.page-object';

const expect = chai.expect;
export class KisilerDeleteDialog {
  deleteModal = element(by.className('modal'));
  private dialogTitle: ElementFinder = element(by.id('koopApp.kisiler.delete.question'));
  private confirmButton = element(by.id('koop-confirm-delete-kisiler'));

  getDialogTitle() {
    return this.dialogTitle;
  }

  async clickOnConfirmButton() {
    await this.confirmButton.click();
  }
}

export default class KisilerComponentsPage {
  createButton: ElementFinder = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('div table .btn-danger'));
  title: ElementFinder = element(by.id('kisiler-heading'));
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
    await navBarPage.getEntityPage('kisiler');
    await waitUntilAnyDisplayed([this.noRecords, this.table]);
    return this;
  }

  async goToCreateKisiler() {
    await this.createButton.click();
    return new KisilerUpdatePage();
  }

  async deleteKisiler() {
    const deleteButton = this.getDeleteButton(this.records.last());
    await click(deleteButton);

    const kisilerDeleteDialog = new KisilerDeleteDialog();
    await waitUntilDisplayed(kisilerDeleteDialog.deleteModal);
    expect(await kisilerDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/koopApp.kisiler.delete.question/);
    await kisilerDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(kisilerDeleteDialog.deleteModal);

    expect(await isVisible(kisilerDeleteDialog.deleteModal)).to.be.false;
  }
}
