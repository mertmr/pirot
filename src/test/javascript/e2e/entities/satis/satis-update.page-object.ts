import { element, by, ElementFinder } from 'protractor';

export default class SatisUpdatePage {
  pageTitle: ElementFinder = element(by.id('koopApp.satis.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  tarihInput: ElementFinder = element(by.css('input#satis-tarih'));
  toplamTutarInput: ElementFinder = element(by.css('input#satis-toplamTutar'));
  ortagaSatisInput: ElementFinder = element(by.css('input#satis-ortagaSatis'));
  kartliSatisInput: ElementFinder = element(by.css('input#satis-kartliSatis'));
  userSelect: ElementFinder = element(by.css('select#satis-user'));
  kisiSelect: ElementFinder = element(by.css('select#satis-kisi'));

  getPageTitle() {
    return this.pageTitle;
  }

  async setTarihInput(tarih) {
    await this.tarihInput.sendKeys(tarih);
  }

  async getTarihInput() {
    return this.tarihInput.getAttribute('value');
  }

  async setToplamTutarInput(toplamTutar) {
    await this.toplamTutarInput.sendKeys(toplamTutar);
  }

  async getToplamTutarInput() {
    return this.toplamTutarInput.getAttribute('value');
  }

  getOrtagaSatisInput() {
    return this.ortagaSatisInput;
  }
  getKartliSatisInput() {
    return this.kartliSatisInput;
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

  async kisiSelectLastOption() {
    await this.kisiSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async kisiSelectOption(option) {
    await this.kisiSelect.sendKeys(option);
  }

  getKisiSelect() {
    return this.kisiSelect;
  }

  async getKisiSelectedOption() {
    return this.kisiSelect.element(by.css('option:checked')).getText();
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
