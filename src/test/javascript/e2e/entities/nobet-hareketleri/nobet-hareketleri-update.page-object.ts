import { element, by, ElementFinder } from 'protractor';

export default class NobetHareketleriUpdatePage {
  pageTitle: ElementFinder = element(by.id('koopApp.nobetHareketleri.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  kasaInput: ElementFinder = element(by.css('input#nobet-hareketleri-kasa'));
  pirotInput: ElementFinder = element(by.css('input#nobet-hareketleri-pirot'));
  farkInput: ElementFinder = element(by.css('input#nobet-hareketleri-fark'));
  nobetSuresiInput: ElementFinder = element(by.css('input#nobet-hareketleri-nobetSuresi'));
  notlarInput: ElementFinder = element(by.css('input#nobet-hareketleri-notlar'));
  acilisKapanisSelect: ElementFinder = element(by.css('select#nobet-hareketleri-acilisKapanis'));
  tarihInput: ElementFinder = element(by.css('input#nobet-hareketleri-tarih'));
  userSelect: ElementFinder = element(by.css('select#nobet-hareketleri-user'));

  getPageTitle() {
    return this.pageTitle;
  }

  async setKasaInput(kasa) {
    await this.kasaInput.sendKeys(kasa);
  }

  async getKasaInput() {
    return this.kasaInput.getAttribute('value');
  }

  async setPirotInput(pirot) {
    await this.pirotInput.sendKeys(pirot);
  }

  async getPirotInput() {
    return this.pirotInput.getAttribute('value');
  }

  async setFarkInput(fark) {
    await this.farkInput.sendKeys(fark);
  }

  async getFarkInput() {
    return this.farkInput.getAttribute('value');
  }

  async setNobetSuresiInput(nobetSuresi) {
    await this.nobetSuresiInput.sendKeys(nobetSuresi);
  }

  async getNobetSuresiInput() {
    return this.nobetSuresiInput.getAttribute('value');
  }

  async setNotlarInput(notlar) {
    await this.notlarInput.sendKeys(notlar);
  }

  async getNotlarInput() {
    return this.notlarInput.getAttribute('value');
  }

  async setAcilisKapanisSelect(acilisKapanis) {
    await this.acilisKapanisSelect.sendKeys(acilisKapanis);
  }

  async getAcilisKapanisSelect() {
    return this.acilisKapanisSelect.element(by.css('option:checked')).getText();
  }

  async acilisKapanisSelectLastOption() {
    await this.acilisKapanisSelect.all(by.tagName('option')).last().click();
  }
  async setTarihInput(tarih) {
    await this.tarihInput.sendKeys(tarih);
  }

  async getTarihInput() {
    return this.tarihInput.getAttribute('value');
  }

  async userSelectLastOption() {
    await this.userSelect.all(by.tagName('option')).last().click();
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
