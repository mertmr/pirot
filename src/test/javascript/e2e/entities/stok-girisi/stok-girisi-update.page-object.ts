import { element, by, ElementFinder } from 'protractor';

export default class StokGirisiUpdatePage {
  pageTitle: ElementFinder = element(by.id('koopApp.stokGirisi.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  miktarInput: ElementFinder = element(by.css('input#stok-girisi-miktar'));
  agirlikInput: ElementFinder = element(by.css('input#stok-girisi-agirlik'));
  notlarInput: ElementFinder = element(by.css('input#stok-girisi-notlar'));
  stokHareketiTipiSelect: ElementFinder = element(by.css('select#stok-girisi-stokHareketiTipi'));
  tarihInput: ElementFinder = element(by.css('input#stok-girisi-tarih'));
  userSelect: ElementFinder = element(by.css('select#stok-girisi-user'));
  urunSelect: ElementFinder = element(by.css('select#stok-girisi-urun'));

  getPageTitle() {
    return this.pageTitle;
  }

  async setMiktarInput(miktar) {
    await this.miktarInput.sendKeys(miktar);
  }

  async getMiktarInput() {
    return this.miktarInput.getAttribute('value');
  }

  async setAgirlikInput(agirlik) {
    await this.agirlikInput.sendKeys(agirlik);
  }

  async getAgirlikInput() {
    return this.agirlikInput.getAttribute('value');
  }

  async setNotlarInput(notlar) {
    await this.notlarInput.sendKeys(notlar);
  }

  async getNotlarInput() {
    return this.notlarInput.getAttribute('value');
  }

  async setStokHareketiTipiSelect(stokHareketiTipi) {
    await this.stokHareketiTipiSelect.sendKeys(stokHareketiTipi);
  }

  async getStokHareketiTipiSelect() {
    return this.stokHareketiTipiSelect.element(by.css('option:checked')).getText();
  }

  async stokHareketiTipiSelectLastOption() {
    await this.stokHareketiTipiSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }
  async setTarihInput(tarih) {
    await this.tarihInput.sendKeys(tarih);
  }

  async getTarihInput() {
    return this.tarihInput.getAttribute('value');
  }

  async userSelectLastOption() {
    await this.userSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async userSelectOption(option) {
    await this.userSelect.sendKeys(option);
  }

  getUserSelect() {
    return this.userSelect;
  }

  async getUserSelectedOption() {
    return this.userSelect.element(by.css('option:checked')).getText();
  }

  async urunSelectLastOption() {
    await this.urunSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async urunSelectOption(option) {
    await this.urunSelect.sendKeys(option);
  }

  getUrunSelect() {
    return this.urunSelect;
  }

  async getUrunSelectedOption() {
    return this.urunSelect.element(by.css('option:checked')).getText();
  }

  async save() {
    await this.saveButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  getSaveButton() {
    return this.saveButton;
  }
}
