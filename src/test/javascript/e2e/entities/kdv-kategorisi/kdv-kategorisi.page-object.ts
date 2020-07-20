import { element, by, ElementFinder, ElementArrayFinder } from 'protractor';

import { waitUntilAnyDisplayed, waitUntilDisplayed, click, waitUntilHidden, isVisible } from '../../util/utils';

import NavBarPage from './../../page-objects/navbar-page';

import KdvKategorisiUpdatePage from './kdv-kategorisi-update.page-object';

const expect = chai.expect;
export class KdvKategorisiDeleteDialog {
  deleteModal = element(by.className('modal'));
  private dialogTitle: ElementFinder = element(by.id('koopApp.kdvKategorisi.delete.question'));
  private confirmButton = element(by.id('koop-confirm-delete-kdvKategorisi'));

  getDialogTitle() {
    return this.dialogTitle;
  }

  async clickOnConfirmButton() {
    await this.confirmButton.click();
  }
}

export default class KdvKategorisiComponentsPage {
  createButton: ElementFinder = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('div table .btn-danger'));
  title: ElementFinder = element(by.id('kdv-kategorisi-heading'));
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
    await navBarPage.getEntityPage('kdv-kategorisi');
    await waitUntilAnyDisplayed([this.noRecords, this.table]);
    return this;
  }

  async goToCreateKdvKategorisi() {
    await this.createButton.click();
    return new KdvKategorisiUpdatePage();
  }

  async deleteKdvKategorisi() {
    const deleteButton = this.getDeleteButton(this.records.last());
    await click(deleteButton);

    const kdvKategorisiDeleteDialog = new KdvKategorisiDeleteDialog();
    await waitUntilDisplayed(kdvKategorisiDeleteDialog.deleteModal);
    expect(await kdvKategorisiDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/koopApp.kdvKategorisi.delete.question/);
    await kdvKategorisiDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(kdvKategorisiDeleteDialog.deleteModal);

    expect(await isVisible(kdvKategorisiDeleteDialog.deleteModal)).to.be.false;
  }
}
