import { element, by, ElementFinder, ElementArrayFinder } from 'protractor';

import { waitUntilAnyDisplayed, waitUntilDisplayed, click, waitUntilHidden, isVisible } from '../../util/utils';

import NavBarPage from './../../page-objects/navbar-page';

import KasaHareketleriUpdatePage from './kasa-hareketleri-update.page-object';

const expect = chai.expect;
export class KasaHareketleriDeleteDialog {
  deleteModal = element(by.className('modal'));
  private dialogTitle: ElementFinder = element(by.id('koopApp.kasaHareketleri.delete.question'));
  private confirmButton = element(by.id('koop-confirm-delete-kasaHareketleri'));

  getDialogTitle() {
    return this.dialogTitle;
  }

  async clickOnConfirmButton() {
    await this.confirmButton.click();
  }
}

export default class KasaHareketleriComponentsPage {
  createButton: ElementFinder = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('div table .btn-danger'));
  title: ElementFinder = element(by.id('kasa-hareketleri-heading'));
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
    await navBarPage.getEntityPage('kasa-hareketleri');
    await waitUntilAnyDisplayed([this.noRecords, this.table]);
    return this;
  }

  async goToCreateKasaHareketleri() {
    await this.createButton.click();
    return new KasaHareketleriUpdatePage();
  }

  async deleteKasaHareketleri() {
    const deleteButton = this.getDeleteButton(this.records.last());
    await click(deleteButton);

    const kasaHareketleriDeleteDialog = new KasaHareketleriDeleteDialog();
    await waitUntilDisplayed(kasaHareketleriDeleteDialog.deleteModal);
    expect(await kasaHareketleriDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/koopApp.kasaHareketleri.delete.question/);
    await kasaHareketleriDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(kasaHareketleriDeleteDialog.deleteModal);

    expect(await isVisible(kasaHareketleriDeleteDialog.deleteModal)).to.be.false;
  }
}
