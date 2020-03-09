import { element, by, ElementFinder } from 'protractor';

export default class VirmanUpdatePage {
  pageTitle: ElementFinder = element(by.id('koopApp.virman.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  tutarInput: ElementFinder = element(by.css('input#virman-tutar'));
  notlarInput: ElementFinder = element(by.css('input#virman-notlar'));
  cikisHesabiSelect: ElementFinder = element(by.css('select#virman-cikisHesabi'));
  girisHesabiSelect: ElementFinder = element(by.css('select#virman-girisHesabi'));
  tarihInput: ElementFinder = element(by.css('input#virman-tarih'));
  userSelect: ElementFinder = element(by.css('select#virman-user'));

  getPageTitle() {
    return this.pageTitle;
  }

  async setTutarInput(tutar) {
    await this.tutarInput.sendKeys(tutar);
  }

  async getTutarInput() {
    return this.tutarInput.getAttribute('value');
  }

  async setNotlarInput(notlar) {
    await this.notlarInput.sendKeys(notlar);
  }

  async getNotlarInput() {
    return this.notlarInput.getAttribute('value');
  }

  async setCikisHesabiSelect(cikisHesabi) {
    await this.cikisHesabiSelect.sendKeys(cikisHesabi);
  }

  async getCikisHesabiSelect() {
    return this.cikisHesabiSelect.element(by.css('option:checked')).getText();
  }

  async cikisHesabiSelectLastOption() {
    await this.cikisHesabiSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }
  async setGirisHesabiSelect(girisHesabi) {
    await this.girisHesabiSelect.sendKeys(girisHesabi);
  }

  async getGirisHesabiSelect() {
    return this.girisHesabiSelect.element(by.css('option:checked')).getText();
  }

  async girisHesabiSelectLastOption() {
    await this.girisHesabiSelect
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
