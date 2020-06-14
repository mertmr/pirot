import { element, by, ElementFinder } from 'protractor';

export default class SatisStokHareketleriUpdatePage {
  pageTitle: ElementFinder = element(by.id('koopApp.satisStokHareketleri.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  miktarInput: ElementFinder = element(by.css('input#satis-stok-hareketleri-miktar'));
  tutarInput: ElementFinder = element(by.css('input#satis-stok-hareketleri-tutar'));
  urunSelect: ElementFinder = element(by.css('select#satis-stok-hareketleri-urun'));
  satisSelect: ElementFinder = element(by.css('select#satis-stok-hareketleri-satis'));

  getPageTitle() {
    return this.pageTitle;
  }

  async setMiktarInput(miktar) {
    await this.miktarInput.sendKeys(miktar);
  }

  async getMiktarInput() {
    return this.miktarInput.getAttribute('value');
  }

  async setTutarInput(tutar) {
    await this.tutarInput.sendKeys(tutar);
  }

  async getTutarInput() {
    return this.tutarInput.getAttribute('value');
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

  async satisSelectLastOption() {
    await this.satisSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async satisSelectOption(option) {
    await this.satisSelect.sendKeys(option);
  }

  getSatisSelect() {
    return this.satisSelect;
  }

  async getSatisSelectedOption() {
    return this.satisSelect.element(by.css('option:checked')).getText();
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
