import { element, by, ElementFinder } from 'protractor';

export default class UrunUpdatePage {
  pageTitle: ElementFinder = element(by.id('koopApp.urun.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  urunAdiInput: ElementFinder = element(by.css('input#urun-urunAdi'));
  stokInput: ElementFinder = element(by.css('input#urun-stok'));
  stokSiniriInput: ElementFinder = element(by.css('input#urun-stokSiniri'));
  musteriFiyatiInput: ElementFinder = element(by.css('input#urun-musteriFiyati'));
  birimSelect: ElementFinder = element(by.css('select#urun-birim'));
  dayanismaUrunuInput: ElementFinder = element(by.css('input#urun-dayanismaUrunu'));
  satistaInput: ElementFinder = element(by.css('input#urun-satista'));
  urunKategorisiSelect: ElementFinder = element(by.css('select#urun-urunKategorisi'));
  activeInput: ElementFinder = element(by.css('input#urun-active'));
  urunSorumlusuSelect: ElementFinder = element(by.css('select#urun-urunSorumlusu'));
  kdvKategorisiSelect: ElementFinder = element(by.css('select#urun-kdvKategorisi'));

  getPageTitle() {
    return this.pageTitle;
  }

  async setUrunAdiInput(urunAdi) {
    await this.urunAdiInput.sendKeys(urunAdi);
  }

  async getUrunAdiInput() {
    return this.urunAdiInput.getAttribute('value');
  }

  async setStokInput(stok) {
    await this.stokInput.sendKeys(stok);
  }

  async getStokInput() {
    return this.stokInput.getAttribute('value');
  }

  async setStokSiniriInput(stokSiniri) {
    await this.stokSiniriInput.sendKeys(stokSiniri);
  }

  async getStokSiniriInput() {
    return this.stokSiniriInput.getAttribute('value');
  }

  async setMusteriFiyatiInput(musteriFiyati) {
    await this.musteriFiyatiInput.sendKeys(musteriFiyati);
  }

  async getMusteriFiyatiInput() {
    return this.musteriFiyatiInput.getAttribute('value');
  }

  async setBirimSelect(birim) {
    await this.birimSelect.sendKeys(birim);
  }

  async getBirimSelect() {
    return this.birimSelect.element(by.css('option:checked')).getText();
  }

  async birimSelectLastOption() {
    await this.birimSelect.all(by.tagName('option')).last().click();
  }
  getDayanismaUrunuInput() {
    return this.dayanismaUrunuInput;
  }
  getSatistaInput() {
    return this.satistaInput;
  }
  async setUrunKategorisiSelect(urunKategorisi) {
    await this.urunKategorisiSelect.sendKeys(urunKategorisi);
  }

  async getUrunKategorisiSelect() {
    return this.urunKategorisiSelect.element(by.css('option:checked')).getText();
  }

  async urunKategorisiSelectLastOption() {
    await this.urunKategorisiSelect.all(by.tagName('option')).last().click();
  }
  getActiveInput() {
    return this.activeInput;
  }
  async urunSorumlusuSelectLastOption() {
    await this.urunSorumlusuSelect.all(by.tagName('option')).last().click();
  }

  async urunSorumlusuSelectOption(option) {
    await this.urunSorumlusuSelect.sendKeys(option);
  }

  getUrunSorumlusuSelect() {
    return this.urunSorumlusuSelect;
  }

  async getUrunSorumlusuSelectedOption() {
    return this.urunSorumlusuSelect.element(by.css('option:checked')).getText();
  }

  async kdvKategorisiSelectLastOption() {
    await this.kdvKategorisiSelect.all(by.tagName('option')).last().click();
  }

  async kdvKategorisiSelectOption(option) {
    await this.kdvKategorisiSelect.sendKeys(option);
  }

  getKdvKategorisiSelect() {
    return this.kdvKategorisiSelect;
  }

  async getKdvKategorisiSelectedOption() {
    return this.kdvKategorisiSelect.element(by.css('option:checked')).getText();
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
