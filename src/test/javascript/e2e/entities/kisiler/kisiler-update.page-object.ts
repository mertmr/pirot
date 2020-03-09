import { element, by, ElementFinder } from 'protractor';

export default class KisilerUpdatePage {
  pageTitle: ElementFinder = element(by.id('koopApp.kisiler.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  kisiAdiInput: ElementFinder = element(by.css('input#kisiler-kisiAdi'));
  notlarInput: ElementFinder = element(by.css('input#kisiler-notlar'));
  tarihInput: ElementFinder = element(by.css('input#kisiler-tarih'));

  getPageTitle() {
    return this.pageTitle;
  }

  async setKisiAdiInput(kisiAdi) {
    await this.kisiAdiInput.sendKeys(kisiAdi);
  }

  async getKisiAdiInput() {
    return this.kisiAdiInput.getAttribute('value');
  }

  async setNotlarInput(notlar) {
    await this.notlarInput.sendKeys(notlar);
  }

  async getNotlarInput() {
    return this.notlarInput.getAttribute('value');
  }

  async setTarihInput(tarih) {
    await this.tarihInput.sendKeys(tarih);
  }

  async getTarihInput() {
    return this.tarihInput.getAttribute('value');
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
