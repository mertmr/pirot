import { element, by, ElementFinder } from 'protractor';

export default class KasaHareketleriUpdatePage {
  pageTitle: ElementFinder = element(by.id('koopApp.kasaHareketleri.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  kasaMiktarInput: ElementFinder = element(by.css('input#kasa-hareketleri-kasaMiktar'));
  hareketInput: ElementFinder = element(by.css('input#kasa-hareketleri-hareket'));
  tarihInput: ElementFinder = element(by.css('input#kasa-hareketleri-tarih'));

  getPageTitle() {
    return this.pageTitle;
  }

  async setKasaMiktarInput(kasaMiktar) {
    await this.kasaMiktarInput.sendKeys(kasaMiktar);
  }

  async getKasaMiktarInput() {
    return this.kasaMiktarInput.getAttribute('value');
  }

  async setHareketInput(hareket) {
    await this.hareketInput.sendKeys(hareket);
  }

  async getHareketInput() {
    return this.hareketInput.getAttribute('value');
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
