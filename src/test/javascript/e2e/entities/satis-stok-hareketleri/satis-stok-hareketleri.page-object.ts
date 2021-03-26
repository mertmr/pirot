import { element, by, ElementFinder, ElementArrayFinder } from 'protractor';

import { waitUntilAnyDisplayed, waitUntilDisplayed, click, waitUntilHidden, isVisible } from '../../util/utils';

import NavBarPage from './../../page-objects/navbar-page';

import SatisStokHareketleriUpdatePage from './satis-stok-hareketleri-update.page-object';

const expect = chai.expect;
export class SatisStokHareketleriDeleteDialog {
  deleteModal = element(by.className('modal'));
  private dialogTitle: ElementFinder = element(by.id('koopApp.satisStokHareketleri.delete.question'));
  private confirmButton = element(by.id('koop-confirm-delete-satisStokHareketleri'));

  getDialogTitle() {
    return this.dialogTitle;
  }

  async clickOnConfirmButton() {
    await this.confirmButton.click();
  }
}

export default class SatisStokHareketleriComponentsPage {
  createButton: ElementFinder = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('div table .btn-danger'));
  title: ElementFinder = element(by.id('satis-stok-hareketleri-heading'));
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
    await navBarPage.getEntityPage('satis-stok-hareketleri');
    await waitUntilAnyDisplayed([this.noRecords, this.table]);
    return this;
  }

  async goToCreateSatisStokHareketleri() {
    await this.createButton.click();
    return new SatisStokHareketleriUpdatePage();
  }

  async deleteSatisStokHareketleri() {
    const deleteButton = this.getDeleteButton(this.records.last());
    await click(deleteButton);

    const satisStokHareketleriDeleteDialog = new SatisStokHareketleriDeleteDialog();
    await waitUntilDisplayed(satisStokHareketleriDeleteDialog.deleteModal);
    expect(await satisStokHareketleriDeleteDialog.getDialogTitle().getAttribute('id')).to.match(
      /koopApp.satisStokHareketleri.delete.question/
    );
    await satisStokHareketleriDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(satisStokHareketleriDeleteDialog.deleteModal);

    expect(await isVisible(satisStokHareketleriDeleteDialog.deleteModal)).to.be.false;
  }
}
